import React from 'react';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the welcome page.
 */
export class WelcomePageContainer extends React.Component {
    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <View style = { styles.container }>
                <Text style = { styles.title }>Enter room name</Text>
                <TextInput
                    style = { styles.textInput }
                    autoFocus = { true }
                    autoCorrect = { false }
                    autoCapitalize = "none"
                    placeholder = "room name"
                    onChangeText = { (text) => this.setState({
                        roomName: text
                    }) }
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

/**
 * WelcomePageContainer component's property types.
 *
 * @static
 */
WelcomePageContainer.propTypes = {
    onJoin: React.PropTypes.func
};
