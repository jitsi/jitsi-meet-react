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
        let underlayColor = ColorPalette.buttonUnderlay;

        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allowed the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        let bottom =
            this.props.visible
                ? styles.toolbarContainer.bottom
                : -Dimensions.get('window').height;

        return (
            <View style = { [styles.toolbarContainer, { bottom }] }>
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
                        name = "hangup"
                        style = { [styles.icon, { color: 'white' }] } />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress = { this._onCameraMute }
                    style = { cameraButtonStyles.buttonStyle }>
                    <Icon
                        name = { cameraButtonStyles.iconName }
                        style = { cameraButtonStyles.iconStyle } />
                </TouchableHighlight>
            </View>
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