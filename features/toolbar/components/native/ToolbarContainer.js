import React, { Component } from 'react';
import {  View,
          Text,
          TouchableHighlight } from 'react-native';

import colorPalette from '../../../base/styles/components/native/styles/ColorPalette';

import styles from './styles/Styles';

import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * The native container rendering the in call main buttons.
 */
export class ToolbarContainer extends Component {
    render() {
        var underlayColor = colorPalette.buttonUnderlay;
        var micButtonStyle;
        var micButtonIcon;
        if (this.props.audioMuted) {
            micButtonStyle = [ styles.toolbarButton,
                                    { backgroundColor: underlayColor }];
            micButtonIcon = "microphone-slash";
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micButtonIcon = "microphone";
        }

        return (
            <View style = { styles.toolbarContainer }>
              <TouchableHighlight
                  style = { micButtonStyle }
                  onPress = { () => this.props.onAudioMute() }>
                  <Icon style = { styles.icon } name = { micButtonIcon }/>
              </TouchableHighlight>
              <TouchableHighlight
                  style = {[ styles.toolbarButton,
                                { backgroundColor: colorPalette.jitsiRed }]}
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
