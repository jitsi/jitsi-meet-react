import { CONNECTION_DISCONNECTED } from '../connection';
import { ReducerRegistry } from '../redux';

import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT
} from './actionTypes';

/**
 * Listen for actions that contain the conference object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/base/conference', (state = null, action) => {
    switch (action.type) {
    case CONFERENCE_JOINED:
        return action.conference;

    case CONNECTION_DISCONNECTED:
    case CONFERENCE_LEFT:
        return null;

    default:
        return state;
    }
});
