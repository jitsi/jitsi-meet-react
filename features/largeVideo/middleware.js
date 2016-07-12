import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_UPDATED
} from '../base/participants';

import { MiddlewareRegistry } from '../base/redux';

import {
    TRACK_ADDED,
    TRACK_REMOVED
} from '../base/tracks';

import {
    selectEndpoint,
    selectParticipantOnStage
} from './actions';

/**
 * Middleware that catches actions related to participants and tracks and
 * dispatches an action to select a participant on stage.
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
    case PARTICIPANT_PINNED:
    case TRACK_ADDED:
    case TRACK_REMOVED:
        store.dispatch(selectParticipantOnStage());
        break;
    case PARTICIPANT_UPDATED:
        var onStageParticipantId =
            store.getState()['features/largeVideo'].onStageParticipantId;

        // In order to minimize re-calculations, we need to select endpoint only
        // if current participant on stage video type has changed.
        if (action.participant.id === onStageParticipantId &&
            'videoType' in action.participant) {
            store.dispatch(selectEndpoint());
        }

        break;
    }

    return result;
};

MiddlewareRegistry.register(largeVideoMiddleware);