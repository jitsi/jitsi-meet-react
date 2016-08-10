import {
    CAMERA_FACING_MODE_CHANGED,
    VIDEO_MUTED_STATE_CHANGED,
    AUDIO_MUTED_STATE_CHANGED
} from './actionTypes';

import { CAMERA_FACING_MODE } from './constants';

import './reducer';

/**
 * Action to signal the change in local audio muted state.
 *
 * @param {boolean} muted - If local audio is muted.
 * @returns {{
 *      type: AUDIO_MUTED_STATE_CHANGED,
 *      media: {
 *          audio: {
 *              muted: boolean
 *          }
 *      }
 *  }}
 */
export function audioMutedStateChanged(muted) {
    return {
        type: AUDIO_MUTED_STATE_CHANGED,
        media: {
            audio: {
                muted
            }
        }
    };
}

/**
 * Action to signal the change in facing mode of local video camera.
 *
 * @param {CAMERA_FACING_MODE} facingMode - Camera facing mode.
 * @returns {{
 *      type: CAMERA_FACING_MODE_CHANGED,
 *      media: {
 *          video: {
 *              facingMode: CAMERA_FACING_MODE
 *          }
 *      }
 *  }}
 */
export function cameraFacingModeChanged(facingMode) {
    return {
        type: CAMERA_FACING_MODE_CHANGED,
        media: {
            video: {
                facingMode
            }
        }
    };
}

/**
 * Action to signal the change in local video muted state.
 *
 * @param {boolean} muted - If local video is muted.
 * @returns {{
 *      type: VIDEO_MUTED_STATE_CHANGED,
 *      media: {
 *          video: {
 *              muted: boolean
 *          }
 *      }
 *  }}
 */
export function videoMutedStateChanged(muted) {
    return {
        type: VIDEO_MUTED_STATE_CHANGED,
        media: {
            video: {
                muted
            }
        }
    };
}

/**
 * Toggles the mute state of the local audio track(s).
 *
 * @returns {Function}
 */
export function toggleAudioMuted() {
    return (dispatch, getState) => {
        const muted = getState()['features/base/media'].audio.muted;

        return dispatch(audioMutedStateChanged(!muted));
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
        const cameraFacingMode
            = mediaState.video.facingMode === CAMERA_FACING_MODE.USER
            ? CAMERA_FACING_MODE.ENVIRONMENT
            : CAMERA_FACING_MODE.USER;

        return dispatch(cameraFacingModeChanged(cameraFacingMode));
    };
}

/**
 * Toggles the mute state of the local video track(s).
 *
 * @returns {Function}
 */
export function toggleVideoMuted() {
    return (dispatch, getState) => {
        const muted = getState()['features/base/media'].video.muted;

        return dispatch(videoMutedStateChanged(!muted));
    };
}
