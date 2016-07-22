import React, { Component } from 'react';
import {
    TouchableHighlight,
    View,
    Dimensions
} from 'react-native';
import Icon from '../../base/fontIcons/JitsiFontIcons';

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
        var underlayColor = ColorPalette.buttonUnderlay;
        var micButtonStyle;
        var micButtonIcon;
        if (this.props.audioMuted) {
            micButtonStyle = [
                styles.toolbarButton,
                { backgroundColor: underlayColor }
            ];
            micIconStyle = [styles.icon, { color: 'white' }];
            micButtonIcon = 'mic-disabled';
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micIconStyle = styles.icon;
            micButtonIcon = 'microphone';
        }

        // The following property is responsible to hide/show the toolbar
        // view by moving it out of site of the screen boundaries.
        // An attempt to use the opacity property has been made in order
        // to eventually implement a fadeIn/fadeOut animation, however a known
        // react native problem has been doscovered, which allows the view to
        // still capture touch events even if hidden. Alternatives will be
        // investigated.
        var bottomValue = styles.toolbarContainer.bottom;
        if (!this.props.isVisible)
            bottomValue = -Dimensions.get('window').height;

        return (
            <View style = { [styles.toolbarContainer,
                            { bottom: bottomValue}] }>
                <TouchableHighlight
                    style = { micButtonStyle }
                    onPress = { () => this.props.onAudioMute() }>
                    <Icon style = { micIconStyle } name = { micButtonIcon }/>
                </TouchableHighlight>
                <TouchableHighlight
                    style = { [
                        styles.toolbarButton,
                        { backgroundColor: ColorPalette.jitsiRed }
                    ] }
                    onPress = { () => this.props.onHangup() }
                    underlayColor = { underlayColor }>
                    <Icon style = { [styles.icon, { color: 'white' }] }
                            name = "hangup"/>
                </TouchableHighlight>
                <TouchableHighlight
                    style = { styles.toolbarButton }
                    onPress = { () => this.props.onCameraChange() }
                    underlayColor = { underlayColor }>
                    <Icon style = { styles.icon } name="photo-camera"/>
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
    onAudioMute: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    audioMuted: React.PropTypes.bool
};
