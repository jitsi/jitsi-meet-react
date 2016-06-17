import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { Conference } from '../../conference';
import Config from '../../../config';

import { WelcomePageContainer } from './_';


/**
 * The welcome page of the application.
 */
class WelcomePage extends Component {
    render() {
        return (
            <WelcomePageContainer
                room={ this.props.room }
                onJoin={ (roomName) => {
                    this.props.onJoin(roomName);
                    this.props.navigator.push({
                        title: "Conference screen",
                        component: Conference
                  });
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
        room: state.client.room
    };
}

/**
 * Maps the onJoin action.
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onJoin: (roomName) => {
            dispatch(Actions.init(Config, roomName))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
