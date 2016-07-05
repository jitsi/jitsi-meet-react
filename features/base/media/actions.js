import {
    createLocalTracks,
    DEVICE_TYPE,
    setLocalTracks
} from '../tracks';

import {
    CAMERA_DISABLED_STATE_CHANGED,
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    MEDIA_RESET,
    MICROPHONE_MUTED_STATE_CHANGED,
    MICROPHONE_DISABLED_STATE_CHANGED
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
function microphoneMutedStateChanged(muted) {
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
function cameraMutedStateChanged(muted) {
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
 * Toggles the mute state of the local tracks with the given media type.
 *
 * @param {DEVICE_TYPE} media - Type of media device to toggle.
 * @returns {Function}
 */
function toggleMediaMuted(media) {
    return (dispatch, getState) => {
        return Promise.all(
            getState()['features/base/tracks']
                .filter(t => t.isLocal() && t.getType() === media)
                .map(track => {
                    let isMuted = track.isMuted();
                    let action = isMuted ? track.unmute() : track.mute();

                    return action
                        .then(() =>
                            dispatch(media === DEVICE_TYPE.VIDEO
                                ? cameraMutedStateChanged(!isMuted)
                                : microphoneMutedStateChanged(!isMuted)));
                }));
    };
}

/**
 * Action to signal the change in camera disabled state.
 *
 * @param {boolean} disabled - If camera is disabled.
 * @returns {{
 *      type: CAMERA_DISABLED_STATE_CHANGED,
 *      media: {
 *          camera: {
 *              disabled: boolean
 *          }
 *      }
 *  }}
 */
export function cameraDisabledStateChanged(disabled) {
    return {
        type: CAMERA_DISABLED_STATE_CHANGED,
        media: {
            camera: {
                disabled
            }
        }
    };
}

/**
 * Action to signal the change in microphone disabled state.
 *
 * @param {boolean} disabled - If microphone is disabled.
 * @returns {{
 *      type: MICROPHONE_DISABLED_STATE_CHANGED,
 *      media: {
 *          microphone: {
 *              disabled: boolean
 *          }
 *      }
 *  }}
 */
export function microphoneDisabledStateChanged(disabled) {
    return {
        type: MICROPHONE_DISABLED_STATE_CHANGED,
        media: {
            microphone: {
                disabled
            }
        }
    };
}

/**
 * Resets media to initial state.
 *
 * @returns {{type: MEDIA_RESET}}
 */
export function resetMedia() {
    return {
        type: MEDIA_RESET
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

        return createLocalTracks({
            devices: [ DEVICE_TYPE.VIDEO ],
            facingMode: cameraFacingMode
        })
        .then(localTracks => dispatch(setLocalTracks(localTracks)))
        .then(() => dispatch(cameraFacingModeChanged(cameraFacingMode)));
    };
}

/**
 * Toggles the mute state of the local audio track(s).
 *
 * @returns {Function}
 */
export function toggleMicrophoneMuted() {
    return toggleMediaMuted(DEVICE_TYPE.AUDIO);
}

/**
 * Toggles the mute state of the local video track(s).
 *
 * @returns {Function}
 */
export function toggleCameraMuted() {
    return toggleMediaMuted(DEVICE_TYPE.VIDEO);
}