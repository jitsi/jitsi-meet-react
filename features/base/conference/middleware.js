import JitsiMeetJS from '../lib-jitsi-meet';
import { MiddlewareRegistry } from '../redux';
import {
    TRACK_ADDED,
    TRACK_REMOVED
} from '../tracks';

const JitsiTrackErrors = JitsiMeetJS.errors.track;

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
            // XXX The library lib-jitsi-meet may be draconian, for example,
            // when adding one and the same video track multiple times.
            if (conference.getLocalTracks().indexOf(track) === -1) {
                promise = conference.addTrack(track)
                    .catch(err => {
                        reportError(
                            'Failed to add local track to conference',
                            err);
                    });
            }
        } else {
            promise = conference.removeTrack(track)
                .catch(err => {
                    // Local track might be already disposed by direct
                    // JitsiTrack#dispose() call. So we should ignore this error
                    // here.
                    if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                        reportError(
                            'Failed to remove local track to conference',
                            err);
                    }
                });
        }
    }

    return promise || Promise.resolve();
};

/**
 * Reports a specific Error with a specific error message. While the
 * implementation merely logs the specified msg and err via the console at the
 * time of this writing, the intention of the function is to abstract the
 * reporting of errors and facilitate elaborating on it in the future.
 *
 * @param {string} msg - The error message to report.
 * @param {Error} err - The Error to report.
 */
function reportError(msg, err) {
    // TODO This is a good point to call some global error handler when we have
    // one.
    console.error(msg, err);
}
