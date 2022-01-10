
import { GAME_ID, MOD_FILE_EXT } from ".";
import { Features } from "./settings";
import { AdvancedInstaller, AdvancedInstallerBuilder, CompatibilityResult, CompatibilityTest, addInstalledPaksAttribute } from "vortex-ext-common/install/advanced";
import { log } from "vortex-api";
import * as path from 'path';
import { IInstallResult, ProgressDelegate } from "vortex-api/lib/types/api";
import { IInstruction, InstructionType } from "vortex-api/lib/extensions/mod_management/types/IInstallResult";

export function getInstaller(): AdvancedInstaller {
    var builder = new AdvancedInstallerBuilder(GAME_ID, MOD_FILE_EXT);
    var installer = builder
        .addExtender(addInstalledPaksAttribute(MOD_FILE_EXT))
        // .addExtender(getContainsPreset, Features.isSicarioEnabled)
        .addSupportedCheck(async (files, gameId, state)=> {return {supported: Features.isInstallerEnabled(state), requiredFiles: []}})
        .build();
    return installer;
}

export const testSupportedContent = (files: string[], gameId: string) => {
    // Make sure we're able to support this mod.
    log('debug', `testing ${files.length} mod files for unreal installer`, {files, targetGame: GAME_ID});
    let supported = (gameId === GAME_ID) &&
        (
            (files.find(file => path.extname(file).toLowerCase() === MOD_FILE_EXT) !== undefined)
            || false
        );

    return Promise.resolve({
        supported,
        requiredFiles: [],
    });
}

export const installContent = async (files: string[], destinationPath: string, gameId: string, progressDelegate: ProgressDelegate): Promise<IInstallResult> => {
    log('debug', `running unreal installer. [${gameId}]`, { files, destinationPath });
    //basically need to keep descending until we find a reliable indicator of mod root
    const modFile = files.find(file => path.extname(file).toLowerCase() === MOD_FILE_EXT);
    if (modFile) {
        // we found a pak file, so disregard anything outside of that
        const idx = modFile.indexOf(path.basename(modFile));
        const rootPath = path.dirname(modFile);
        const filtered = files.filter(file =>
            ((file.indexOf(rootPath) !== -1)
                && (!file.endsWith(path.sep))));

        // const filtered = files.filter(file => (((root == "." ? true : (file.indexOf(root) !== -1)) && (!file.endsWith(path.sep)))));
        log('debug', 'filtered extraneous files', { root: rootPath, candidates: filtered });
        const instructions = filtered.map(file => {
            // const destination = file.substr(firstType.indexOf(path.basename(root)) + root.length).replace(/^\\+/g, '');
            const destination = path.join(file.substr(idx));
            return {
                type: 'copy' as InstructionType,
                source: file,
                destination: destination
            }
        });
        return Promise.resolve({ instructions });
    } else {
        log('warn', "Couldn't find reliable root indicator in file list. Falling back to basic installation!");
            var instructions = files.map((file: string): IInstruction => {
                return {
                    type: 'copy',
                    source: file,
                    destination: file,
                };
            });
            return Promise.resolve({ instructions });
    }
};

export const testSaveGameContent = (files: string[], gameId: string) => {
    log('debug', `testing ${files.length} mod files for HZD save game`, {files, targetGame: GAME_ID});
    let supported = (gameId === GAME_ID) &&
        (
            (
                (files.find(file => path.basename(file).toLowerCase() === 'checkpoint.dat') !== undefined) &&
                (files.find(file => path.basename(file).toLowerCase() === 'slotinfo.ini') !== undefined)
            ) || false
        );

    return Promise.resolve({
        supported,
        requiredFiles: [],
    });
};