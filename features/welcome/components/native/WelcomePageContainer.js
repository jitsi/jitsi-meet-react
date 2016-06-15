import React from 'react';
import {  View,
          Text,
          TouchableHighlight,
          TextInput } from 'react-native';

import styles from './styles/WelcomePageStyle';

/**
 * The native container rendering the welcome page.
 */
class WelcomePageContainer extends React.Component {

  render() {
      return (
          <View style = { styles.container }>
            <Text style = { styles.title }>Enter room name</Text>
            <TextInput  style = { styles.textInput }
                    autoFocus = { true }
                    autoCorrect = { false }
                    autoCapitalize = "none"
                    placeholder = "room name"
                    onChangeText = { (text) => this.setState({
                        roomName: text
                    })}
                    />
            <TouchableHighlight
                style = { styles.button }
                onPress = { () => this.props.onJoin(this.state.roomName) }
                underlayColor = "white">
                <Text style = { styles.buttonText }> JOIN </Text>
            </TouchableHighlight>
        </View>
    );
  }
}

export default WelcomePageContainer;
