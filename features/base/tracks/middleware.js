import {
    LIB_DISPOSED,
    LIB_INITIALIZED
} from '../lib-jitsi-meet';
import {
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    MEDIA_TYPE,
    MICROPHONE_MUTED_STATE_CHANGED
} from '../media';
import { MiddlewareRegistry } from '../redux';

import {
    createLocalTracks,
    destroyLocalTracks
} from './actions';

/**
 * Middleware that captures LIB_INITIALIZED and LIB_DISPOSED actions
 * and respectively creates/destroys local media tracks.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CAMERA_FACING_MODE_CHANGED:
        store.dispatch(
            createLocalTracks({
                devices: [ MEDIA_TYPE.VIDEO ],
                facingMode: action.media.camera.facingMode
            })
        );
        break;

    case CAMERA_MUTED_STATE_CHANGED:
        _setTrackMuted(store, MEDIA_TYPE.VIDEO, action.media.camera.muted);
        break;

    case MICROPHONE_MUTED_STATE_CHANGED:
        _setTrackMuted(store, MEDIA_TYPE.AUDIO, action.media.microphone.muted);
        break;

    case LIB_INITIALIZED:
        store.dispatch(createLocalTracks());
        break;

    case LIB_DISPOSED:
        store.dispatch(destroyLocalTracks());
        break;
    }

    return next(action);
});

/**
 * Mute or unmute local track if it exists.
 *
 * @param {Store} store - Redux store.
 * @param {MEDIA_TYPE} mediaType - Type of track to change muted state of.
 * @param {boolean} muted - If audio stream should be muted or unmuted.
 * @returns {Promise|undefined}
 */
function _setTrackMuted(store, mediaType, muted) {
    let tracks = store.getState()['features/base/tracks'];
    let localTrack = tracks
        .find(t => t.isLocal() && t.getType() === mediaType);

    if (!localTrack) {
        return;
    }

    if (muted) {
        return localTrack.mute()
            .catch(err => console.warn('Track mute was rejected:', err));
    } else {
        return localTrack.unmute()
            .catch(err => console.warn('Track unmute was rejected:', err));
    }
}
