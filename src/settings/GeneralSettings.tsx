import * as React from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { Toggle, ComponentEx, More, util } from 'vortex-api';
import { enableAdvancedInstaller, Features } from './actions';
import { IState } from 'vortex-api/lib/types/api';
import { I18N_NAMESPACE } from '..';
const { HelpBlock, FormGroup, ControlLabel } = require('react-bootstrap');

interface IBaseProps {
    t: any
}

interface IConnectedProps {
    enableAdvanced: boolean;
}

interface IActionProps {
    onEnableAdvanced: (enable: boolean) => void;
}

type IProps = IConnectedProps & IActionProps & IBaseProps;

class GeneralSettings extends ComponentEx<IProps, {}> {

    public render(): JSX.Element {
        const { t, enableAdvanced, onEnableAdvanced } = this.props;
        return (
            <form>
                <FormGroup>
                    <ControlLabel>{t('Enable Advanced Installer for Horizon Zero Dawn')}</ControlLabel>
                    <HelpBlock>
                        {t('Use the option below to disable the interactive installer for Horizon Zero Dawn mods and fall back to using a basic installer. Only turn this off if you are having problems with the default installer!')}
                    </HelpBlock>
                    <Toggle
                        checked={enableAdvanced}
                        onToggle={onEnableAdvanced}
                    >
                        {t("Enable Interactive Installer")}
                        <More id='pw-advanced' name='Advanced Interactive Installer'>
                            {t("When installing archives with more than one mod file, Vortex will attempt to walk you through installing only the files you need. You can use this option to turn off this behaviour and simply install the first directory containing mod files it finds in the archive. Only change this if you know what you're doing!")}
                        </More>
                    </Toggle>
                </FormGroup>
            </form>
        );
    }
}


function mapStateToProps(state: IState): IConnectedProps {
    return {
        enableAdvanced: Features.isInstallerEnabled(state)
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<any, null, Redux.Action>): IActionProps {
    return {
        onEnableAdvanced: (enable: boolean) => dispatch(enableAdvancedInstaller(enable))
    }
}

export default
    withTranslation(['common', I18N_NAMESPACE, 'game-horizonzerodawn'])(connect(mapStateToProps, mapDispatchToProps)(GeneralSettings));