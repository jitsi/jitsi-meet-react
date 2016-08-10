import {
    LIB_DISPOSED,
    LIB_INITIALIZED
} from '../lib-jitsi-meet';
import {
    CAMERA_FACING_MODE_CHANGED,
    VIDEO_MUTED_STATE_CHANGED,
    MEDIA_TYPE,
    AUDIO_MUTED_STATE_CHANGED
} from '../media';
import { MiddlewareRegistry } from '../redux';

import {
    createLocalTracks,
    destroyLocalTracks
} from './actions';
import { getLocalTrack } from './functions';

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
                facingMode: action.media.video.facingMode
            })
        );
        break;

    case VIDEO_MUTED_STATE_CHANGED:
        _setTrackMuted(store, MEDIA_TYPE.VIDEO, action.media.video.muted);
        break;

    case AUDIO_MUTED_STATE_CHANGED:
        _setTrackMuted(store, MEDIA_TYPE.AUDIO, action.media.audio.muted);
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
    const tracks = store.getState()['features/base/tracks'];
    const localTrack = getLocalTrack(tracks, mediaType);

    if (!localTrack) {
        return;
    }

    if (muted) {
        return localTrack.jitsiTrack.mute()
            .catch(err => console.warn('Track mute was rejected:', err));
    }

    return localTrack.jitsiTrack.unmute()
        .catch(err => console.warn('Track unmute was rejected:', err));
}
