import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { navigate } from '../../base/navigation';
import { Conference } from '../../conference';
import Config from '../../../config';

import { WelcomePageContainer } from './_';


/**
 * The welcome page of the application.
 */
class WelcomePage extends Component {
    /**
     * Render a WelcomePageContainer, which will show the room name
     * prompt appropriate for mobile or web.
     */
    render() {
        return (
            <WelcomePageContainer
                room={ this.props.room }
                onJoin={ (roomName) => {
                    this.props.onJoin(roomName, this.props.navigator);
                    }
                }/>
        );
    }
}

/**
 * Maps the state room property to component props.
 */
const mapStateToProps = state => {
    return {
        room: state['features/welcome'].room
    };
}

/**
 * Maps the onJoin action.
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
