import { createLocalTracks } from '../tracks';

import {
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    MICROPHONE_MUTED_STATE_CHANGED
} from './actionTypes';

import {
    CAMERA_FACING_MODE,
    MEDIA_TYPE
} from './constants';

import './reducer';


/**
 * Action to signal the change in facing mode of local video camera.
 *
 * @param {CAMERA_FACING_MODE} facingMode - Camera facing mode.
 * @returns {{
 *      type: CAMERA_FACING_MODE_CHANGED,
 *      media: {
 *          camera: {
 *              facingMode: CAMERA_FACING_MODE
 *          }
 *      }
 *  }}
 */
function cameraFacingModeChanged(facingMode) {
    return {
        type: CAMERA_FACING_MODE_CHANGED,
        media: {
            camera: {
                facingMode
            }
        }
    };
}

/**
 * Action to signal the change in camera muted state.
 *
 * @param {boolean} muted - If camera is muted.
 * @returns {{
 *      type: CAMERA_MUTED_STATE_CHANGED,
 *      media: {
 *          camera: {
 *              muted: boolean
 *          }
 *      }
 *  }}
 */
export function cameraMutedStateChanged(muted) {
    return {
        type: CAMERA_MUTED_STATE_CHANGED,
        media: {
            camera: {
                muted
            }
        }
    };
}

/**
 * Action to signal the change in microphone muted state.
 *
 * @param {boolean} muted - If microphone is muted.
 * @returns {{
 *      type: MICROPHONE_MUTED_STATE_CHANGED,
 *      media: {
 *          microphone: {
 *              muted: boolean
 *          }
 *      }
 *  }}
 */
export function microphoneMutedStateChanged(muted) {
    return {
        type: MICROPHONE_MUTED_STATE_CHANGED,
        media: {
            microphone: {
                muted
            }
        }
    };
}

/**
 * Mute or unmute local video stream if it exists.
 *
 * @param {boolean} muted - If video stream should be muted or unmuted.
 * @returns {Function}
 */
export function setCameraMuted(muted) {
    return (dispatch, getState) => {
        let tracks = getState()['features/base/tracks'];
        let localVideo = tracks.find(t => t.isLocal() && t.isVideoTrack());

        if (!localVideo) {
            return;
        }

        if (muted) {
            return localVideo.mute()
                .then(() => dispatch(cameraMutedStateChanged(true)))
                .catch(err => console.warn('Video mute was rejected:', err));
        } else {
            return localVideo.unmute()
                .then(() => dispatch(cameraMutedStateChanged(false)))
                .catch(err => console.warn('Video unmute was rejected:', err));
        }
    };
}

/**
 * Mute or unmute local audio stream if it exists.
 *
 * @param {boolean} muted - If audio stream should be muted or unmuted.
 * @returns {Function}
 */
export function setMicrophoneMuted(muted) {
    return (dispatch, getState) => {
        let tracks = getState()['features/base/tracks'];
        let localAudio = tracks.find(t => t.isLocal() && t.isAudioTrack());

        if (!localAudio) {
            return;
        }

        if (muted) {
            return localAudio.mute()
                .then(() => dispatch(microphoneMutedStateChanged(true)))
                .catch(err => console.warn('Audio mute was rejected:', err));
        } else {
            return localAudio.unmute()
                .then(() => dispatch(microphoneMutedStateChanged(false)))
                .catch(err => console.warn('Audio unmute was rejected:', err));
        }
    };
}

/**
 * Toggles the camera between front and rear (user and environment).
 *
 * @returns {Function}
 */
export function toggleCameraFacingMode() {
    return (dispatch, getState) => {
        const mediaState = getState()['features/base/media'];
        const cameraFacingMode =
            mediaState.camera.facingMode === CAMERA_FACING_MODE.USER
                ? CAMERA_FACING_MODE.ENVIRONMENT
                : CAMERA_FACING_MODE.USER;

        return dispatch(
            createLocalTracks({
                devices: [ MEDIA_TYPE.VIDEO ],
                facingMode: cameraFacingMode
            })
        )
        .then(() => dispatch(cameraFacingModeChanged(cameraFacingMode)));
    };
}

/**
 * Toggles the mute state of the local video track(s).
 *
 * @returns {Function}
 */
export function toggleCameraMuted() {
    return (dispatch, getState) => {
        let muted = getState()['features/base/media'].camera.muted;

        return dispatch(setCameraMuted(!muted));
    };
}

/**
 * Toggles the mute state of the local audio track(s).
 *
 * @returns {Function}
 */
export function toggleMicrophoneMuted() {
    return (dispatch, getState) => {
        let muted = getState()['features/base/media'].microphone.muted;

        return dispatch(setMicrophoneMuted(!muted));
    };
}