import React, { Component } from 'react';

import { ColorPalette } from '../../../base/styles';

import styles from './styles/Styles';

import Icon from 'react-fontawesome';



export class ToolbarContainer extends Component {
    render() {
        var underlayColor = ColorPalette.buttonUnderlay;
        var micButtonStyle;
        var micButtonIcon;
        if (this.props.audioMuted) {
            micButtonStyle = { ...styles.toolbarButton,
                                    backgroundColor: underlayColor };
            micButtonIcon = "microphone-slash";
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micButtonIcon = "microphone";
        }

        return (
            <div style = { styles.toolbarContainer }>
              <button
                  style = { micButtonStyle }
                  onClick = { () => this.props.onAudioMute() }>
                  <Icon style = { styles.icon } name = { micButtonIcon } />
              </button>
              <button
                  style = {{...styles.toolbarButton,
                            backgroundColor: ColorPalette.jitsiRed }}
                  onClick= { () => this.props.onHangup() }>
                  <Icon style = { styles.icon } name = "phone" />
              </button>
              <button
                  style = { styles.toolbarButton }
                  onClick= { () => this.props.onCameraChange() }>
                  <Icon style = { styles.icon } name="camera" />
              </button>
          </div>
        );
    } 
}

