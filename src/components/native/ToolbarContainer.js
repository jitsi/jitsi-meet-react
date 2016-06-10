import React, { Component } from 'react';
import {  View,
          Text,
          TouchableHighlight } from 'react-native';

import styles from './styles/ToolbarStyle';

class ToolbarContainer extends Component {

    render() {
        var underlayColor = 'grey';
        return (
            <View style={styles.toolbarContainer}>
              <TouchableHighlight
                  style={styles.toolbarButton}
                  onPress={() => this.props.onAudioMute()}
                  underlayColor={underlayColor}>
                  <Text style={styles.text}> Mike </Text>
              </TouchableHighlight>
              <TouchableHighlight
                  style={styles.hangupButton}
                  onPress={() => this.props.onHangup()}
                  underlayColor={underlayColor}>
                  <Text style={styles.text}> Hang up </Text>
              </TouchableHighlight>
              <TouchableHighlight
                  style={styles.toolbarButton}
                  onPress={() => this.props.onCameraChange()}
                  underlayColor={underlayColor}>
                  <Text style={styles.text}>Flip Cam</Text>
              </TouchableHighlight>
          </View>
        );
    }
}

export default ToolbarContainer;
