import React, { Component } from 'react';

import {
    APP_SCREEN,
    navigate
} from '../../app';

/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
export class AbstractWelcomePage extends Component {
    /**
     * Initializes a new AbstractWelcomePage instance, including the initial
     * state of the room name input.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        this.state = { roomName: '' };

        // Bind event handlers so they are only bound once for every instance.
        this._onJoinPress = this._onJoinPress.bind(this);
        this._onRoomNameChange = this._onRoomNameChange.bind(this);
    }

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        this.props.dispatch(navigate({
            navigator: this.props.navigator,
            room: this.state.roomName,
            screen: APP_SCREEN.CONFERENCE
        }));
    }

    /**
     * Handles 'change' event for the room name input field.
     *
     * @param {string} value - Name for room.
     * @protected
     * @returns {void}
     */
    _onRoomNameChange(value) {
        this.setState({ roomName: value });
    }
}

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractWelcomePage.propTypes = {
    dispatch: React.PropTypes.func,
    navigator: React.PropTypes.object
};
