import {
    CAMERA_FACING_MODE,
    MEDIA_TYPE
} from '../base/media';
import { createLocalTracks } from '../base/tracks';

import {
    CHANGE_CAMERA_FACING_MODE,
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE
} from './actionTypes';
import './reducer';

/**
 * Toggles the mute state of the local audio track(s).
 *
 * @returns {Function}
 */
export function toggleAudio() {
    return toggleMedia(MEDIA_TYPE.AUDIO);
}

/**
 * Toggles the camera between front and rear (user and environment).
 *
 * @returns {Function}
 */
export function toggleCameraFacingMode() {
    return (dispatch, getState) => {
        const stateFeaturesToolbar = getState()['features/toolbar'];
        const cameraFacingMode =
            stateFeaturesToolbar.cameraFacingMode === CAMERA_FACING_MODE.USER
                ? CAMERA_FACING_MODE.ENVIRONMENT
                : CAMERA_FACING_MODE.USER;

        return dispatch(
                createLocalTracks({
                    devices: [ MEDIA_TYPE.VIDEO ],
                    facingMode: cameraFacingMode
                })
            )
            .then(() => {
                dispatch({
                    type: CHANGE_CAMERA_FACING_MODE,
                    cameraFacingMode
                });
            });
    };
}

/**
 * Toggles the mute state of the local tracks with the given media type.
 *
 * @param {MEDIA_TYPE} media - Type of media device to toggle ('audio'/'video').
 * @returns {Function}
 */
function toggleMedia(media) {
    return (dispatch, getState) => {
        const tracks = getState()['features/base/tracks'];
        const localTracks = tracks.filter(t => t.local);

        for (let track of localTracks) {
            const type = track.mediaType;

            if (type === media) {
                if (track.muted) {
                    track.jitsiTrack.unmute();
                } else {
                    track.jitsiTrack.mute();
                }
            }
        }

        dispatch({
            type: media === MEDIA_TYPE.VIDEO
                ? TOGGLE_VIDEO_MUTED_STATE
                : TOGGLE_AUDIO_MUTED_STATE
        });
    };
}

/**
 * Toggles the mute state of the local video track(s).
 *
 * @returns {Function}
 */
export function toggleVideo() {
    return toggleMedia(MEDIA_TYPE.VIDEO);
}
