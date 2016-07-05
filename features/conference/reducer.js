import { ReducerRegistry } from '../base/redux';

import {
    CONFERENCE_CREATED,
    CONFERENCE_LEFT
} from './actionTypes';

/**
 * Listen for actions that contain the conference object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/conference', (state = null, action) => {
    switch (action.type) {
    case CONFERENCE_CREATED:
        return action.conference;

    case CONFERENCE_LEFT:
        return null;

    default:
        return state;
    }
});