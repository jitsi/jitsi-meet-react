import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from '../../base/navigation';

import { WelcomePageContainer } from './_';

/**
 * The welcome page of the application.
 */
class WelcomePage extends Component {
    /**
     * Constructs new WelcomePage Component.
     *
     * @param {Object} props - React props.
     */
    constructor(props) {
        super(props);

        this._onJoin = this._onJoin.bind(this);
    }

    /**
     * Dispatches navigation action when "Join" button is clicked to join a
     * new conference with provided room name.
     *
     * @param {string} roomName - Name of conference room.
     * @param {Navigator} navigator - Navigator instance.
     * @private
     * @returns {void}
     */
    _onJoin(roomName, navigator) {
        this.props.dispatch(navigate({
            screen: 'conference',
            room: roomName,
            navigator
        }));
    }

    /**
     * Implements React's {@link Component#render()}. Renders
     * a WelcomePageContainer which is to show the room name prompt appropriate
     * for mobile or web.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <WelcomePageContainer
                onJoin={ roomName =>
                    this._onJoin(roomName, this.props.navigator)
                }/>
        );
    }
}

/**
 * WelcomePage component's property types.
 *
 * @static
 */
WelcomePage.propTypes = {
    dispatch: React.PropTypes.func,
    navigator: React.PropTypes.object
};

export default connect()(WelcomePage);