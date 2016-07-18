import React, { Component } from 'react';

import { setRoomName } from '../actions';

/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
export class AbstractWelcomePageContainer extends Component {
    /**
     * Initialize the WelcomePageContainer, including the initial
     * state of the room name input.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        this._onRoomNameChange = this._onRoomNameChange.bind(this);
        this._onJoinPress = this._onJoinPress.bind(this);
    }

    /**
     * Handles 'change' event for the room name input field.
     *
     * @param {string} value - Name for room.
     * @protected
     * @returns {void}
     */
    _onRoomNameChange(value) {
        this.props.dispatch(setRoomName(value));
    }

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        this.props.onJoin(this.props.roomName);
    }
}

/**
 * Maps roomName property from state  to component props. It seems it's not
 * possible to 'connect' base component and then extend from it. So we export
 * this function in order to be used in child classes for 'connect'.
 *
 * @param {Object} state - Redux state.
 * @returns {{ roomName: string }}
 */
export const mapStateToProps = state => {
    const stateFeaturesWelcome = state['features/welcome'];

    return {
        roomName: stateFeaturesWelcome.roomName
    };
};

/**
 * WelcomePageContainer component's property types.
 *
 * @static
 */
AbstractWelcomePageContainer.propTypes = {
    dispatch: React.PropTypes.func,
    onJoin: React.PropTypes.func,
    roomName: React.PropTypes.string
};