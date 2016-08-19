import React from 'react';
import {
    TouchableHighlight,
    View
} from 'react-native';
import { connect } from 'react-redux';

import { Icon } from '../../base/fontIcons';
import {
    MEDIA_TYPE,
    toggleCameraFacingMode
} from '../../base/media';
import { Container } from '../../base/react';
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

        // TODO Use correct Jitsi icon for camera switch button when available.

        return (
            <Container
                style = { styles.toolbarContainer }
                visible = { this.props.visible }>

                <View
                    style = { styles.toggleCameraFacingModeContainer }>
                    <TouchableHighlight
                        onPress = { this._onCameraFacingModeToggle }
                        style = { styles.toggleCameraFacingModeButton }
                        underlayColor = 'transparent'>
                        <Icon
                            name = { AbstractToolbar.icons.cameraSwitchIcon }
                            style = { styles.whiteIcon } />
                    </TouchableHighlight>
                </View>
                <View
                    style = { styles.toolbarButtonsContainer }>
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
                            name = { AbstractToolbar.icons.hangupIcon }
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
            </Container>
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
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
