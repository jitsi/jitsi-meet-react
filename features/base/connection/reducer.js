import { ReducerRegistry } from '../redux';

import {
    CONNECTION_CREATED,
    CONNECTION_DISCONNECTED
} from './actionTypes';

/**
 * Listen for actions that contain the connection object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/base/connection', (state = null, action) => {
    switch (action.type) {
    case CONNECTION_CREATED:
        return action.connection;

    case CONNECTION_DISCONNECTED:
        return (state === action.connection) ? null : state;

    default:
        return state;
    }
});
