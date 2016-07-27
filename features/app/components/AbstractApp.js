import React, { Component } from 'react';

import {
    disposeLib,
    initLib
} from '../../base/lib-jitsi-meet';
import {
    localParticipantJoined,
    localParticipantLeft
} from '../../base/participants';

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends Component {
    /**
     * Init lib-jitsi-meet and create local participant when component is going
     * to be mounted.
     *
     * @inheritdoc
     */
    componentWillMount() {
        let dispatch = this.props.store.dispatch;
        dispatch(localParticipantJoined());
        dispatch(initLib(this.props.config));
    }

    /**
     * Dispose lib-jitsi-meet and remove local participant when component is
     * going to be unmounted.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        let dispatch = this.props.store.dispatch;
        dispatch(localParticipantLeft());
        dispatch(disposeLib());
    }
}

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractApp.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object
};