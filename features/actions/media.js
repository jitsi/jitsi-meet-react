import {
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE,
    CHANGE_CAMERA_FACING_MODE,
    CAMERA_FACING_MODE
} from '../constants';

import {
    createLocalTracks
} from './tracks';

/**
 * Toggle the mute state of the local tracks with the given media type.
 */
function toggleMedia(media) {
    return (dispatch, getState) => {
        const localTracks = getState().localTracks;
        for (let track of localTracks) {
            console.log(track.getType(), '==?', media);
            if (track.getType() !== media) {
                continue;
            }
            if (track.isMuted()) {
                track.unmute();
            } else {
                track.mute();
            }
        }

        dispatch({
            type: media === 'video'
                ? TOGGLE_VIDEO_MUTED_STATE
                : TOGGLE_AUDIO_MUTED_STATE
        });
    };
}

/**
 * Toggle the mute state of the local audio track.
 */
export function toggleAudio() {
    return toggleMedia('audio');
}

/**
 * Toggle the mute state of the local video track.
 */
export function toggleVideo() {
    return toggleMedia('video');
}


/**
 * Toggles the camera between front and rear (user and environment).
 */
export function toggleCameraFacingMode() {
    return (dispatch, getState) => {
        const media = getState().media;
        
        const newFacingMode = media.cameraFacingMode === CAMERA_FACING_MODE.USER
            ? CAMERA_FACING_MODE.ENVIRONMENT
            : CAMERA_FACING_MODE.USER;

        return dispatch(
                createLocalTracks({
                    devices: ['video'],
                    facingMode: newFacingMode
                })
            )
            .then(() => {
                return dispatch({
                    type: CHANGE_CAMERA_FACING_MODE,
                    media: {
                        cameraFacingMode: newFacingMode
                    }
                });
            });
    };
}