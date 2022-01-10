import * as path from 'path';
import { IInstruction } from 'vortex-api/lib/types/api';
import { MOD_FILE_EXT } from '.';
import { remote } from "electron";

export const UserPaths = {
	userDataPath: (): string => path.join(remote.app.getPath('home'), 'Documents', 'Horizon Zero Dawn'),
	userConfigPath: (): string => path.join(UserPaths.userDataPath(), 'Saved Game', 'profile'),
	saveGamesPath: (): string => path.join(UserPaths.userDataPath(), 'Saved Game'),
}

export const isToolMod = async (instructions: IInstruction[]): Promise<boolean> => {
	let exeSources = instructions.filter(f => f.type == "copy" && path.extname(f.source).toLowerCase() == '.exe');
	let pakSources = instructions.filter(f => f.type == "copy" && path.extname(f.source).toLowerCase() == MOD_FILE_EXT);
	return exeSources.length > 0 && pakSources.length == 0;
}

export const isSaveGame = async (instructions: IInstruction[]): Promise<boolean> => {
	let checkpointFiles = instructions.filter(f => f.type == "copy" && path.basename(f.source).toLowerCase() === 'checkpoint.dat');
	let slotFiles = instructions.filter(f => f.type == "copy" && path.basename(f.source).toLowerCase() === 'slotinfo.ini');
	return checkpointFiles.length > 0 && slotFiles.length > 0;
}