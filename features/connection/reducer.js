import { ReducerRegistry } from '../base/redux';

import {
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED
} from './actionTypes';

/**
 * Listen for actions that contain the connection object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/connection', (state = null, action) => {
    switch (action.type) {
    case JITSI_CLIENT_CREATED:
        return action.connection;

    case JITSI_CLIENT_DISCONNECTED:
        return null;

    default:
        return state;
    }
});
