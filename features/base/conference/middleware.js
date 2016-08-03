import { PARTICIPANT_PINNED } from '../participants';
import { MiddlewareRegistry } from '../redux';
import {
    TRACK_ADDED,
    TRACK_REMOVED
} from '../tracks';

import {
    _addLocalTracksToConference,
    _removeLocalTracksFromConference
} from './functions';

/**
 * This middleware intercepts TRACK_ADDED and TRACK_REMOVED actions to sync
 * conference's local tracks with local tracks in state. Also captures
 * PARTICIPANT_PINNED action to pin participant in conference.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case TRACK_ADDED:
    case TRACK_REMOVED:
        let track = action.track;

        if (track && track.isLocal()) {
            return syncConferenceLocalTracksWithState(store, action)
                .then(() => next(action));
        }
        break;

    case PARTICIPANT_PINNED:
        pinParticipant(store, action.participant.id);
        break;
    }

    return next(action);
});

/**
 * Pins remote participant in conference, ignores local participant.
 *
 * @param {Store} store - Redux store.
 * @param {string|null} id - Participant id or null if no one is currently
 * pinned.
 * @returns {void}
 */
function pinParticipant(store, id) {
    let state = store.getState();
    let conference = state['features/base/conference'].jitsiConference;
    let participants = state['features/base/participants'];
    let participantById = participants.find(p => p.id === id);
    let localParticipant = participants.find(p => p.local);

    // This condition prevents signaling to pin local participant. Here is
    // the logic: if we have ID, then we check if participant by that ID is
    // local. If we don't have ID and thus no participant by ID, we check
    // for local participant. If it's currently pinned, then this action
    // will unpin him and that's why we won't signal here too.
    if ((participantById && !participantById.local) ||
        (!participantById && (!localParticipant || !localParticipant.pinned))) {
        conference.pinParticipant(id);
    }
}

/**
 * Syncs local tracks from state with local tracks in JitsiConference instance.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @returns {Promise}
 */
function syncConferenceLocalTracksWithState(store, action) {
    const conference =
        store.getState()['features/base/conference'].jitsiConference;
    let promise;

    if (conference) {
        let track = action.track;

        if (action.type === TRACK_ADDED) {
            promise = _addLocalTracksToConference(conference, [ track ]);
        } else {
            promise = _removeLocalTracksFromConference( conference, [ track ]);
        }
    }

    return promise || Promise.resolve();
}
