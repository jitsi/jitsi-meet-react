import React from 'react';
import {
    Dimensions,
    TouchableHighlight,
    View
} from 'react-native';
import { connect } from 'react-redux';

import { Icon } from '../../base/fontIcons';
import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { toggleCameraFacingMode } from '../actions';
import { styles } from './styles';

/**
 * The native container rendering the in call main buttons.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Constructs new Toolbar component.
     *
     * @param {Object} props - Component props.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onCameraFacingModeToggle
            = this._onCameraFacingModeToggle.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const cameraButtonStyles = this._getMuteButtonStyles('camera');
        const microphoneButtonStyles = this._getMuteButtonStyles('microphone');
        const underlayColor = ColorPalette.buttonUnderlay;

        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allowed the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        const bottom = this.props.visible
            ? {}
            : { bottom: -Dimensions.get('window').height };

        // TODO: use correct Jitsi icon for camera switch button when available

        return (
            <View style = { styles.toolbarContainer }>
                <View
                    style = { [
                        styles.toggleCameraFacingModeContainer,
                        bottom
                    ] }>
                    <TouchableHighlight
                        onPress = { this._onCameraFacingModeToggle }
                        style = { styles.toggleCameraFacingModeButton }
                        underlayColor = 'transparent'>
                        <Icon
                            name = 'reload'
                            style = { styles.whiteIcon } />
                    </TouchableHighlight>
                </View>
                <View
                    style = { [
                        styles.toolbarButtonsContainer,
                        bottom
                    ] }>
                    <TouchableHighlight
                        onPress = { this._onMicrophoneMute }
                        style = { microphoneButtonStyles.buttonStyle }>
                        <Icon
                            name = { microphoneButtonStyles.iconName }
                            style = { microphoneButtonStyles.iconStyle } />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress = { this._onHangup }
                        style = { [
                            styles.toolbarButton,
                            { backgroundColor: ColorPalette.jitsiRed }
                        ] }
                        underlayColor = { underlayColor }>
                        <Icon
                            name = 'hangup'
                            style = { styles.whiteIcon } />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress = { this._onCameraMute }
                        style = { cameraButtonStyles.buttonStyle }>
                        <Icon
                            name = { cameraButtonStyles.iconName }
                            style = { cameraButtonStyles.iconStyle } />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    /**
     * Switches between front and rear cameras.
     *
     * @private
     * @returns {void}
     */
    _onCameraFacingModeToggle() {
        this.props.dispatch(toggleCameraFacingMode());
    }
}

/**
 * Additional properties for various icons, which are now platform-dependent.
 * This is done to have common logic of generating styles for web and native.
 * TODO: as soon as we have common font sets for web and native, this will be no
 * longer required.
 */
Object.assign(Toolbar.prototype, {
    cameraIcon: 'webCam',
    cameraMutedIcon: 'camera-disabled',
    microphoneIcon: 'microphone',
    microphoneMutedIcon: 'mic-disabled'
});

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
