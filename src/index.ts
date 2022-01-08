import { fs, log, util } from "vortex-api";
import * as path from 'path';
import { IDiscoveryResult, IExtensionContext, IGameStoreEntry, IMod } from 'vortex-api/lib/types/api';

import { getGamePath, isActiveGame, isGameManaged } from "vortex-ext-common";

import { getInstaller, installContent, testSupportedContent } from "./install";
import { isToolMod, UserPaths } from "./util";
import { installedFilesRenderer } from "./attributes";
import { GeneralSettings, settingsReducer } from "./settings";

export const GAME_ID = 'horizonzerodawn'
export const I18N_NAMESPACE = 'horizonvortex';
export const STEAMAPP_ID = 1151640;
export const MOD_FILE_EXT = ".bin";

export type ModList = { [modId: string]: IMod; };

export const getModPath = (gamePath: string): string => {
    return path.join('Packed_DX12'); //TODO
}

export function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID.toString()])
        .then((game: IGameStoreEntry) => game.gamePath);
}


//This is the main function Vortex will run when detecting the game extension. 
function main(context: IExtensionContext) {
    const isHorizonManaged = (): boolean => {
        return isGameManaged(context.api, GAME_ID);
    }
    const installer = getInstaller();
    context.once(() => {
        log('debug', 'initialising Horizon Zero Dawn extension!');
        try {
            let langContent = fs.readFileSync(path.join(__dirname, 'language.json'), {encoding: 'utf-8'});
            context.api.getI18n().addResources('en', I18N_NAMESPACE, JSON.parse(langContent));
            // using require here instead of `fs` means that webpack will bundle the language file for us
            // unfortunately this doesn't seem to actually work for some reason.
            // context.api.getI18n().addResources('en', I18N_NAMESPACE, require('./language.json'));
        } catch { }

        installer.configure(context.api);
    });

    context.registerSettings('Interface', GeneralSettings, undefined, isHorizonManaged, 101);
    context.registerReducer(['settings', 'hzd'], settingsReducer);

    context.registerGame({
        name: "Horizon Zero Dawn",
        mergeMods: true,
        logo: 'gameart.png',
        supportedTools: [],
        executable: () => 'HorizonZeroDawn.exe', //TODO
        requiredFiles: [
            'ProjectWingman.exe' //TODO
        ],
        id: GAME_ID,
        queryPath: findGame,
        queryModPath: getModPath,
        setup: async (discovery: IDiscoveryResult): Promise<void> => {
            log('debug', 'running wingvortex setup');
            try {
                await fs.ensureDirWritableAsync(path.join(discovery.path, getModPath(discovery.path)));
            } catch (err) {
                log('error', `Error while setting up HZD`, {err})
                context.api.sendNotification({
                    type: 'warning',
                    title: 'Game directory not writeable',
                    message: 'The game directory appears to be read-only. Not all features will be available.',
                    actions: [
                        {title: 'More',
                            action: dismiss => {
                                context.api.showDialog('error', 'Read-only game directory!', {
                                    text: getRODialogText()
                                }, [
                                    {label: "Close", action: () => dismiss()}
                                ]);
                            }}
                    ]
                });
            }
        },
        environment: {
            SteamAPPId: STEAMAPP_ID.toString()
        },
        details: {
            steamAppId: STEAMAPP_ID,
            settingsPath: () => UserPaths.userConfigPath(),
            appDataPath: () => UserPaths.userDataPath()
        },
        compatible: {
        },
        onStart: 'hide'
    });

    //this adds a new mod type just so that tools go into the root directory instead
    context.registerModType(
        'hzd-tools',
        10,
        gameId => gameId === GAME_ID,
        (game) => getGamePath(game, context.api.getState(), true),
        (inst) => isToolMod(inst),
        {
            name: "HZD Modding Tool",
            mergeMods: true,
            //this actually should be deployment essential, for everything except XGP
            //if we made it essential, XGP would completely fail
            //this way Steam/GOG *should* still work but XGP will be a non-fatal warning
            deploymentEssential: false
        }
    );

    context.registerInstaller(
        'hzd-binmods-advanced',
        25,
        installer.testSupported,
        installer.advancedInstall
    );
    context.registerInstaller(
        'hzd-binmods',
        50,
        testSupportedContent,
        (files, destination, gameId, progress) => installContent(files, destination, gameId, progress)
    );

    /* context.registerTableAttribute('mods', {
        id: 'hzd-bins',
        placement: 'detail',
        name: 'Installed files',
        help: 'Which specific files from the mod were installed',
        edit: {},
        isToggleable: true,
        isSortable: false,
        calc: (mod: IMod) => util.getSafe(mod.attributes, ['installedPaks'], []),
        condition: () => isActiveGame(context.api, GAME_ID),
        customRenderer: (mod: IMod) => installedFilesRenderer(context.api, mod)
    }); */

    return true;
}

function getRODialogText(): string {
    return "Your Horizon Zero Dawn game directory appears to be read-only.\n\n" +
        "Note that Vortex will still try its best to manage mods using your user directory, but this is largely unsupported.\n"
}

module.exports = {
    default: main,
};