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
import {
    getLocalTrack,
    setTrackMuted
} from './functions';

/**
 * Middleware that captures LIB_INITIALIZED and LIB_DISPOSED actions
 * and respectively creates/destroys local media tracks. Also listens to media-
 * related actions and performs corresponding operations with tracks.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case AUDIO_MUTED_STATE_CHANGED: {
        const tracks = store.getState()['features/base/tracks'];

        setTrackMuted(
            (getLocalTrack(tracks, MEDIA_TYPE.AUDIO) || {}).jitsiTrack,
            action.media.audio.muted
        );

        break;
    }

    case CAMERA_FACING_MODE_CHANGED:
        store.dispatch(
            createLocalTracks({
                devices: [ MEDIA_TYPE.VIDEO ],
                facingMode: action.media.video.facingMode
            })
        );
        break;

    case LIB_INITIALIZED:
        store.dispatch(createLocalTracks());
        break;

    case LIB_DISPOSED:
        store.dispatch(destroyLocalTracks());
        break;

    case VIDEO_MUTED_STATE_CHANGED: {
        const tracks = store.getState()['features/base/tracks'];

        setTrackMuted(
            (getLocalTrack(tracks, MEDIA_TYPE.VIDEO) || {}).jitsiTrack,
            action.media.video.muted
        );

        break;
    }
    }

    return next(action);
});
