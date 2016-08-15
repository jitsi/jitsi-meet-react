import React from 'react';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';

import { getRoomAndDomainFromUrlString } from '../../app';
import { setDomain } from '../../base/connection';
import { setRoom } from '../../base/conference';

import {
    AbstractWelcomePage,
    mapStateToProps
} from './AbstractWelcomePage';
import { styles } from './styles';

/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Renders a prompt for entering a room name.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <View style = { styles.container }>
                { this._renderLocalVideo() }
                <View style = { styles.roomContainer }>
                    <Text style = { styles.title }>Enter room name</Text>
                    <TextInput
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        autoFocus = { true }
                        onChangeText = { this._onRoomChange }
                        placeholder = 'room name'
                        style = { styles.textInput }
                        value = { this.state.room } />
                    <TouchableHighlight
                        disabled = { this._isJoinDisabled() }
                        onPress = { this._onJoinPress }
                        style = { styles.button }
                        underlayColor = 'white'>
                        <Text style = { styles.buttonText }>JOIN</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    /**
     * Handles click on 'Join' button. Tries to parse input as URL first.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        const dispatch = this.props.dispatch;
        const { domain, room } = getRoomAndDomainFromUrlString(this.state.room);

        // XXX Here we first try to treat our input as URL and extract domain
        // and room name from it. If we fail to parse our input as URL, then
        // it's just a room name and we can proceed with our base case.
        if (domain && room) {
            dispatch(setDomain(domain));
            dispatch(setRoom(room));
        } else {
            super._onJoinPress();
        }
    }
}

/**
 * WelcomePage component's property types.
 *
 * @static
 */
WelcomePage.propTypes = AbstractWelcomePage.propTypes;

export default connect(mapStateToProps)(WelcomePage);
