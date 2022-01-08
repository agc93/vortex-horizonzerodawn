import { createAction } from 'redux-act';
import { util } from "vortex-api";
import { IReducerSpec, IState } from 'vortex-api/lib/types/api';

/*
 * enable the more advanced installer
 */
export const enableAdvancedInstaller =
    createAction('HZD_ENABLE_INSTALLER', (enable: boolean) => enable);

/**
 * reducer for extension settings
 */
export const settingsReducer: IReducerSpec = {
    reducers: {
        [enableAdvancedInstaller as any]: (state, payload: boolean) => {
            return util.setSafe(state, ['installer'], payload);
        }
    },
    defaults: {
        installer: true
    }
};

export const Features = {
    isInstallerEnabled: (state: IState): boolean => {
        return util.getSafe(state.settings, ['hzd', 'installer'], true);
    }
}