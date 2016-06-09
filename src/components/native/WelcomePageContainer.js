import React from 'react';
import {  View,
          Text,
          TouchableHighlight,
          TextInput } from 'react-native';

import styles from './styles/MainStyle';

class WelcomePageContainer extends React.Component {

  render() {
      let roomName = '';
      return (
          <View style={styles.container}>
            <Text style={styles.title}>Enter room name</Text>
            <TextInput  style={styles.textInput}
                    autoFocus={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="room name"
                    onChangeText={(text) => {roomName = text;}}
                    />
            <TouchableHighlight
                style={styles.button}
                onPress={() => this.props.onJoin(roomName)}
                underlayColor="white">
                <Text style={styles.buttonText}> JOIN </Text>
            </TouchableHighlight>
        </View>
    );
  }
}

export default WelcomePageContainer;
