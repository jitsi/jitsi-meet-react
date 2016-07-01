import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from '../../app';

import { WelcomePageContainer } from './_';

/**
 * The welcome page of the application.
 */
class WelcomePage extends Component {
    /**
     * Render a WelcomePageContainer, which will show the room name
     * prompt appropriate for mobile or web.
     *
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <WelcomePageContainer
                room={ this.props.room }
                onJoin={ roomName =>
                        this.props.onJoin(roomName, this.props.navigator)
                }/>
        );
    }
}

/**
 * Maps the state room property to component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{ room: string }}
 */
const mapStateToProps = state => {
    return {
        room: state['features/welcome'].room
    };
};

/**
 * Maps the onJoin action.
 *
 * @param {Function} dispatch - Redux dispatch function.
 * @returns {{ onJoin: Function }}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onJoin: (roomName, navigator) => {
            dispatch(navigate({
                screen: 'conference',
                room: roomName,
                navigator
            }));
        }
    };
};

/**
 * Prop types for component.
 */
WelcomePage.propTypes = {
    onJoin: React.PropTypes.func,
    room: React.PropTypes.string,
    navigator: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
