import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from '../../base/navigation';

import { WelcomePageContainer } from './_';

/**
 * The welcome page of the application.
 */
class WelcomePage extends Component {
    /**
     * Implements React's {@link Component#render()}. Renders a
     * WelcomePageContainer which is to show the room name prompt appropriate
     * for mobile or web.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <WelcomePageContainer
                onJoin={ roomName =>
                        this.props.onJoin(roomName, this.props.navigator)
                }/>
        );
    }
}

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
 * WelcomePage component's property types.
 *
 * @static
 */
WelcomePage.propTypes = {
    navigator: React.PropTypes.object,
    onJoin: React.PropTypes.func
};

export default connect(null, mapDispatchToProps)(WelcomePage);
