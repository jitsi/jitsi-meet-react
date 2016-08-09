import {
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    MICROPHONE_MUTED_STATE_CHANGED
} from './actionTypes';

import { CAMERA_FACING_MODE } from './constants';

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
export function cameraFacingModeChanged(facingMode) {
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
 * Toggles the camera between front and rear (user and environment).
 *
 * @returns {Function}
 */
export function toggleCameraFacingMode() {
    return (dispatch, getState) => {
        const mediaState = getState()['features/base/media'];
        const cameraFacingMode
            = mediaState.camera.facingMode === CAMERA_FACING_MODE.USER
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
export function toggleCameraMuted() {
    return (dispatch, getState) => {
        const muted = getState()['features/base/media'].camera.muted;

        return dispatch(cameraMutedStateChanged(!muted));
    };
}

/**
 * Toggles the mute state of the local audio track(s).
 *
 * @returns {Function}
 */
export function toggleMicrophoneMuted() {
    return (dispatch, getState) => {
        const muted = getState()['features/base/media'].microphone.muted;

        return dispatch(microphoneMutedStateChanged(!muted));
    };
}
