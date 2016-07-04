import { ReducerRegistry } from '../base/redux';

import {
    CONNECTION_DISCONNECTED,
    CONNECTION_ESTABLISHED
} from './actionTypes';

/**
 * Listen for actions that contain the connection object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/connection', (state = null, action) => {
    switch (action.type) {
    case CONNECTION_ESTABLISHED:
        return action.connection;

    case CONNECTION_DISCONNECTED:
        return null;

    default:
        return state;
    }
});
