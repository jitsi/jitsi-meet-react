import React, { Component } from 'react';

import { roomSet } from '../../base/conference';
import { navigate } from '../../base/navigator';
import { Conference } from '../../conference';

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

        /**
         * Save room name into component's local state.
         *
         * @type {{room: string}}
         */
        this.state = {
            room: ''
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onJoinPress = this._onJoinPress.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
    }

    /**
     * This method is executed when component receives new properties.
     *
     * @inheritdoc
     * @param {Object} nextProps - New props component will receive.
     */
    componentWillReceiveProps(nextProps) {
        this.setState({ room: nextProps.room });
    }

    /**
     * Resets room name to empty string when welcome page screen is entered.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillMount() {
        this.props.dispatch(roomSet(''));
    }

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        this.props.dispatch(roomSet(this.state.room));

        this.props.dispatch(navigate({
            component: Conference,
            navigator: this.props.navigator,
            room: this.state.room
        }));
    }

    /**
     * Handles 'change' event for the room name input field.
     *
     * @param {string} value - Name for room.
     * @protected
     * @returns {void}
     */
    _onRoomChange(value) {
        this.setState({ room: value });
    }
}

/**
 * Maps room property from state  to component props. It seems it's not
 * possible to 'connect' base component and then extend from it. So we export
 * this function in order to be used in child classes for 'connect'.
 *
 * @param {Object} state - Redux state.
 * @returns {{ room: string }}
 */
export const mapStateToProps = state => {
    const stateFeaturesConference = state['features/base/conference'];

    return {
        room: stateFeaturesConference.room
    };
};

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractWelcomePage.propTypes = {
    dispatch: React.PropTypes.func,
    navigator: React.PropTypes.object,
    room: React.PropTypes.string
};
