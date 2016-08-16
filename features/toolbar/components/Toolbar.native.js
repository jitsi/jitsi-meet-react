import React from 'react';
import {
    Dimensions,
    TouchableHighlight,
    View
} from 'react-native';
import { connect } from 'react-redux';

import { Icon } from '../../base/fontIcons';
import {
    MEDIA_TYPE,
    toggleCameraFacingMode
} from '../../base/media';
import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { styles } from './styles';

/**
 * Implements the conference toolbar on React Native.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Initializes a new Toolbar instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
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
        const audioButtonStyles = this._getMuteButtonStyles(MEDIA_TYPE.AUDIO);
        const videoButtonStyles = this._getMuteButtonStyles(MEDIA_TYPE.VIDEO);
        const underlayColor = ColorPalette.buttonUnderlay;

        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allowed the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        const bottom
            = this.props.visible
                ? {}
                : { bottom: -Dimensions.get('window').height };

        // TODO Use correct Jitsi icon for camera switch button when available.

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

                        // eslint-disable-next-line react/jsx-handler-names
                        onPress = { this._toggleAudio }
                        style = { audioButtonStyles.buttonStyle }>
                        <Icon
                            name = { audioButtonStyles.iconName }
                            style = { audioButtonStyles.iconStyle } />
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

                        // eslint-disable-next-line react/jsx-handler-names
                        onPress = { this._toggleVideo }
                        style = { videoButtonStyles.buttonStyle }>
                        <Icon
                            name = { videoButtonStyles.iconName }
                            style = { videoButtonStyles.iconStyle } />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    /**
     * Switches between the front/user-facing and rear/environment-facing
     * cameras.
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
 * TODO As soon as we have common font sets for web and native, this will no
 * longer be required.
 */
Object.assign(Toolbar.prototype, {
    audioIcon: 'microphone',
    audioMutedIcon: 'mic-disabled',
    videoIcon: 'webCam',
    videoMutedIcon: 'camera-disabled'
});

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
