import { ReducerRegistry } from '../redux';

import {
    CONNECTION_DISCONNECTED,
    CONNECTION_ESTABLISHED
} from './actionTypes';

/**
 * Listen for actions that contain the connection object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/base/connection', (state = null, action) => {
    switch (action.type) {
    case CONNECTION_DISCONNECTED:
        return state === action.connection ? null : state;

    case CONNECTION_ESTABLISHED:
        return action.connection;

    default:
        return state;
    }
});
