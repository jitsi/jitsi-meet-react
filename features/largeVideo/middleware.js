import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PIN_PARTICIPANT
} from '../base/participants';
import { MiddlewareRegistry } from '../base/redux';
import {
    getTrackByJitsiTrack,
    TRACK_ADDED,
    TRACK_REMOVED,
    TRACK_UPDATED
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
    let result = next(action);

    switch (action.type) {
    case DOMINANT_SPEAKER_CHANGED:
    case PARTICIPANT_JOINED:
    case PARTICIPANT_LEFT:
    case PIN_PARTICIPANT:
    case TRACK_ADDED:
    case TRACK_REMOVED:
        store.dispatch(selectParticipantInLargeVideo());
        break;

    case TRACK_UPDATED: {
        // In order to minimize re-calculations, we need to select endpoint only
        // if the videoType of the current participant rendered in LargeVideo
        // has changed.
        if ('videoType' in action.track) {
            let state = store.getState();
            let track =
                getTrackByJitsiTrack(
                    state['features/base/tracks'],
                    action.track.jitsiTrack);
            let participantId = state['features/largeVideo'].participantId;

            if (track.participantId === participantId) {
                store.dispatch(selectEndpoint());
            }
        }
        break;
    }
    }

    return result;
};

MiddlewareRegistry.register(largeVideoMiddleware);
