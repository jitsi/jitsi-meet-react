import React, { Component } from 'react';
import {
    TouchableHighlight,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ColorPalette } from '../../../base/styles';

import styles from './styles/Styles';

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
        if (this.props.microphoneMuted) {
            micButtonStyle = [
                styles.toolbarButton,
                { backgroundColor: underlayColor }
            ];
            micButtonIcon = 'microphone-slash';
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micButtonIcon = 'microphone';
        }

        return (
            <View style = { styles.toolbarContainer }>
                <TouchableHighlight
                    style = { micButtonStyle }
                    onPress = { () => this.props.onAudioMute() }>
                    <Icon style = { styles.icon } name = { micButtonIcon }/>
                </TouchableHighlight>
                <TouchableHighlight
                    style = { [
                        styles.toolbarButton,
                        { backgroundColor: ColorPalette.jitsiRed }
                    ] }
                    onPress = { () => this.props.onHangup() }
                    underlayColor = { underlayColor }>
                    <Icon style = { styles.icon } name = "phone"/>
                </TouchableHighlight>
                <TouchableHighlight
                    style = { styles.toolbarButton }
                    onPress = { () => this.props.onCameraChange() }
                    underlayColor = { underlayColor }>
                    <Icon style = { styles.icon } name="camera"/>
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
    microphoneMuted: React.PropTypes.bool,
    cameraMuted: React.PropTypes.bool
};
