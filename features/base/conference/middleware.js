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
 * conference's local tracks with local tracks in state.
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
    }

    return next(action);
});

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
