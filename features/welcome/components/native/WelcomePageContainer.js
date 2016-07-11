import React from 'react';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';

import { WelcomePageContainer as BaseWelcomePageContainer } from '../base';
import styles from './styles/Styles';

/**
 * The native container rendering the welcome page.
 *
 * @extends BaseWelcomePageContainer
 */
export class WelcomePageContainer extends BaseWelcomePageContainer {
    /**
     * Renders a prompt for entering a room name.
     *
     * @override BaseWelcomePageContainer#render()
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
                    onChangeText = { this._onRoomNameChange }
                    />
                <TouchableHighlight
                    disabled = { this.state.roomName === '' }
                    style = { styles.button }
                    onPress = { this._onJoinPress }
                    underlayColor = "white">
                    <Text style = { styles.buttonText }> JOIN </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

WelcomePageContainer.propTypes = BaseWelcomePageContainer.propTypes;