import React, { Component } from 'react';

/**
 * Base class for container component rendering the welcome page.
 *
 * @abstract
 */
export class WelcomePageContainer extends Component {
    /**
     * Initialize the WelcomePageContainer, including the initial
     * state of the room name input.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        this.state = {
            roomName: ''
        };

        this._onRoomNameChange = this._onRoomNameChange.bind(this);
        this._onJoinPress = this._onJoinPress.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @abstract
     * @returns {ReactElement}
     */
    render() {
        throw new Error('This method is abstract and should be overridden ' +
            'inside child classes');
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

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        this.props.onJoin(this.state.roomName);
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
