import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PIN_PARTICIPANT
} from '../base/participants';
import { MiddlewareRegistry } from '../base/redux';
import {
    TRACK_ADDED,
    TRACK_REMOVED,
    TRACK_CHANGED
} from '../base/tracks';

import {
    selectEndpoint,
    selectParticipantInLargeVideo
} from './actions';

/**
 * Middleware that catches actions related to participants and tracks and
 * dispatches an action to select a participant depicted by LargeVideo.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
const largeVideoMiddleware = store => next => action => {
    let participantId;
    let result = next(action);
    let state;
    let track;

    switch (action.type) {
    case DOMINANT_SPEAKER_CHANGED:
    case PARTICIPANT_JOINED:
    case PARTICIPANT_LEFT:
    case PIN_PARTICIPANT:
    case TRACK_ADDED:
    case TRACK_REMOVED:
        store.dispatch(selectParticipantInLargeVideo());
        break;

    case TRACK_CHANGED:
        // In order to minimize re-calculations, we need to select endpoint only
        // if the videoType of the current participant rendered in LargeVideo
        // has changed.
        if ('videoType' in action.track) {
            state = store.getState();
            participantId = state['features/largeVideo'].participantId;
            track = state['features/base/tracks'].find(
                t => t.jitsiTrack === action.track.jitsiTrack);

            if (track.participantId === participantId) {
                store.dispatch(selectEndpoint());
            }
        }
        break;
    }

    return result;
};

MiddlewareRegistry.register(largeVideoMiddleware);
