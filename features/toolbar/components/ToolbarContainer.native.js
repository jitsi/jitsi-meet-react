import React, { Component } from 'react';
import {
    Dimensions,
    TouchableHighlight,
    View
} from 'react-native';

import { Icon } from '../../base/fontIcons';
import { ColorPalette } from '../../base/styles';

import { styles } from './styles';

/**
 * The native container rendering the in call main buttons.
 */
export class ToolbarContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const underlayColor = ColorPalette.buttonUnderlay;
        let micButtonStyle;
        let micIconStyle;
        let micButtonIcon;

        if (this.props.audioMuted) {
            micButtonStyle = [
                styles.toolbarButton,
                { backgroundColor: underlayColor }
            ];
            micIconStyle = [ styles.icon, { color: 'white' }];
            micButtonIcon = 'mic-disabled';
        } else {
            micButtonStyle = styles.toolbarButton;
            micIconStyle = styles.icon;
            micButtonIcon = 'microphone';
        }

        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allowed the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        const bottom
            = this.props.visible
                ? styles.toolbarContainer.bottom
                : -Dimensions.get('window').height;

        return (
            <View style = { [ styles.toolbarContainer, { bottom }] }>

                <TouchableHighlight
                    onPress = { this.props.onAudioMute }
                    style = { micButtonStyle }>

                    <Icon
                        name = { micButtonIcon }
                        style = { micIconStyle } />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress = { this.props.onHangup }
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
                    onPress = { this.props.onCameraChange }
                    style = { styles.toolbarButton }
                    underlayColor = { underlayColor }>

                    <Icon
                        name = 'photo-camera'
                        style = { styles.icon } />
                </TouchableHighlight>
            </View>
        );
    }
}

/**
 * ToolbarContainer component's property types.
 *
 * @static
 */
ToolbarContainer.propTypes = {
    audioMuted: React.PropTypes.bool,
    onAudioMute: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    visible: React.PropTypes.bool
};
