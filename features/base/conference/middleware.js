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
const conferenceMiddleware = store => next => action => {
    let actionType = action.type;
    let track = action.track;

    if ((actionType === TRACK_ADDED || actionType === TRACK_REMOVED) &&
        track &&
        track.isLocal()) {
        return syncConferenceLocalTracksWithState(store, action)
            .then(() => next(action));
    } else {
        return next(action);
    }
};

/**
 * Syncs local tracks from state with local tracks in JitsiConference instance.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @returns {Promise}
 */
const syncConferenceLocalTracksWithState = (store, action) => {
    const conference = store.getState()['features/base/conference'];
    let promise = Promise.resolve();

    if (conference) {
        let actionType = action.type;
        let track = action.track;

        if (actionType === TRACK_ADDED) {
            const conferenceLocalTracks = conference.getLocalTracks();

            // XXX The library lib-jitsi-meet may be draconian, for example,
            // when adding one and the same video track multiple times.
            if (conferenceLocalTracks.indexOf(track) === -1) {
                promise = conference.addTrack(track)
                    .catch(err => {
                        // TODO: This is a good point to call some global
                        // error handler when we have one.
                        console.error(
                            'Failed to add local track to conference', err);
                    });
            }
        } else {
            promise = conference.removeTrack(track)
                .catch(err => {
                    // Local track might be already disposed by direct
                    // JitsiTrack#dispose() call. So we should ignore this
                    // error here.
                    if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                        // TODO: This is a good point to call some global
                        // error handler when we have one.
                        console.error('Failed to remove local track to ' +
                            'conference', err);
                    }
                });
        }
    }

    return promise;
};

MiddlewareRegistry.register(conferenceMiddleware);