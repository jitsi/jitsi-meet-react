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
    selectParticipant,
    selectParticipantInLargeVideo
} from './actions';

/**
 * Middleware that catches actions related to participants and tracks and
 * dispatches an action to select a participant depicted by LargeVideo.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

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
        // In order to minimize re-calculations, we need to select participant
        // only if the videoType of the current participant rendered in
        // LargeVideo has changed.
        if ('videoType' in action.track) {
            const state = store.getState();
            const track
                = getTrackByJitsiTrack(
                    state['features/base/tracks'],
                    action.track.jitsiTrack);
            const participantId = state['features/largeVideo'].participantId;

            if (track.participantId === participantId) {
                store.dispatch(selectParticipant());
            }
        }
        break;
    }
    }

    return result;
});
