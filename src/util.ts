import * as path from 'path';
import { IInstruction } from 'vortex-api/lib/types/api';
import { MOD_FILE_EXT } from '.';
import { remote } from "electron";

//TODO all of this
export const UserPaths = {
	userDataPath: (): string => path.join(remote.app.getPath('home'), 'Documents', 'Horizon Zero Dawn', 'Saved Game'),
	userConfigPath: (): string => getUserConfigPath(),
	saveGamesPath: (): string => UserPaths.userDataPath(),
}

function getUserConfigPath() {
    return path.join(UserPaths.userDataPath(), 'profile');
}

export const isToolMod = async (instructions: IInstruction[]): Promise<boolean> => {
	let exeSources = instructions.filter(f => f.type == "copy" && path.extname(f.source).toLowerCase() == '.exe');
	let pakSources = instructions.filter(f => f.type == "copy" && path.extname(f.source).toLowerCase() == MOD_FILE_EXT);
	return exeSources.length > 0 && pakSources.length == 0;
}