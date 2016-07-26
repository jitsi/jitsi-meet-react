import React from 'react';
import Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { styles } from './styles';

/**
 * The native container rendering the in call main buttons.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const cameraButtonStyles = this._getMuteButtonStyles('camera');
        const microphoneButtonStyles = this._getMuteButtonStyles('microphone');

        return (
            <div style = { styles.toolbarContainer }>
                <div style = { styles.toolbarButtonsContainer }>
                    <button
                        onClick = { this._onMicrophoneMute }
                        style = { microphoneButtonStyles.buttonStyle }>
                        <Icon
                            name = { microphoneButtonStyles.iconName }
                            style = { microphoneButtonStyles.iconStyle } />
                    </button>
                    <button
                        onClick= { this._onHangup }
                        style = { {
                            ...styles.toolbarButton,
                            backgroundColor: ColorPalette.jitsiRed
                        } }>
                        <Icon name = "phone" style = { styles.icon } />
                    </button>
                    <button
                        onClick= { this._onCameraMute }
                        style = { cameraButtonStyles.buttonStyle }>
                        <Icon
                            name = { cameraButtonStyles.iconName }
                            style = { cameraButtonStyles.iconStyle } />
                    </button>
                </div>
            </div>
        );
    }
}

/**
 * Additional properties for various icons, which are now platform-dependent.
 * This is done to have common logic of generating styles for web and native.
 * TODO: as soon as we have common font sets for web and native, this will be no
 * longer required.
 */
Object.assign(Toolbar.prototype, {
    cameraIcon: 'video-camera',
    // TODO: currently for web version we're using default FontAwesome
    // font set, which doesn't have 'slashed' version of 'video-camera'
    // icon. But this should be changed as soon as we start to use
    // custom Jitsi icons.
    cameraMutedIcon: 'video-camera',
    microphoneIcon: 'microphone',
    microphoneMutedIcon: 'microphone-slash'
});

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
