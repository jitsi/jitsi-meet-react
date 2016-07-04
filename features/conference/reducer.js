import { ReducerRegistry } from '../base/redux';

import {
    JITSI_CONFERENCE_JOINED,
    JITSI_CONFERENCE_LEFT
} from './actionTypes';

/**
 * Listen for actions that contain the conference object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/conference', (state = null, action) => {
    switch (action.type) {
    case JITSI_CONFERENCE_JOINED:
        return action.conference;

    case JITSI_CONFERENCE_LEFT:
        return null;

    default:
        return state;
    }
});