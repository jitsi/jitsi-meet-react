import JitsiMeetJS from '../lib-jitsi-meet';

import {
    createLocalTracks,
    DEVICE_TYPE,
    setLocalTracks
} from '../tracks';

import {
    AUDIO_OUTPUT_DEVICE_CHANGED,
    CAMERA_DEVICE_CHANGED,
    CAMERA_DISABLED_STATE_CHANGED,
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    DEVICE_LIST_CHANGED,
    MEDIA_RESET,
    MICROPHONE_DEVICE_CHANGED,
    MICROPHONE_MUTED_STATE_CHANGED,
    MICROPHONE_DISABLED_STATE_CHANGED
} from './actionTypes';

import {
    CAMERA_FACING_MODE,
    DEVICE_KIND
} from './constants';

import { default as mediaDeviceHelper } from './mediaDeviceHelper';

import './reducer';

/**
 * Action for JitsiMediaDevicesEvents.DEVICE_LIST_CHANGED to
 * handle change of available media devices.
 *
 * @private
 * @param {MediaDeviceInfo[]} devices - New list of devices.
 * @returns {Function}
 */
function onDeviceListChanged(devices) {
    return (dispatch, getState) => {
        let mediaState = getState()['features/base/media'];
        let currentDevices = mediaDeviceHelper.getCurrentMediaDevicesByKind();

        // Event handler can be fired before direct enumerateDevices() call,
        // so handle this situation here.
        if (!currentDevices.audioinput &&
            !currentDevices.videoinput &&
            !currentDevices.audiooutput) {
            dispatch(deviceListChanged(devices));
            currentDevices = devices.splice(0);
        }

        let newDevices = mediaDeviceHelper
            .getNewMediaDevicesAfterDeviceListChanged(devices);
        let promises = [];

        let audioWasMuted = mediaState.microphone.muted;
        let videoWasMuted = mediaState.camera.muted;

        let availableAudioInputDevices = mediaDeviceHelper
            .getDevicesFromListByKind(devices, DEVICE_KIND.AUDIO_INPUT);
        let availableVideoInputDevices = mediaDeviceHelper
            .getDevicesFromListByKind(devices, DEVICE_KIND.VIDEO_INPUT);

        if (typeof newDevices.audiooutput !== 'undefined') {
            // Just ignore any errors in catch block.
            promises.push(dispatch(setAudioOutputDevice(newDevices.audiooutput))
                .catch());
        }

        promises.push(
            mediaDeviceHelper.createLocalTracksAfterDeviceListChanged(
                newDevices.videoinput,
                newDevices.audioinput)
                .then(tracks => dispatch(setLocalTracks(tracks)))
                .then(() => {
                    // If audio was muted before, or we unplugged current device
                    // and selected new one, then mute new audio track.
                    if (audioWasMuted ||
                        currentDevices.audioinput.length >
                        availableAudioInputDevices.length) {
                        dispatch(setMicrophoneMuted(true));
                    }

                    // If video was muted before, or we unplugged current device
                    // and selected new one, then mute new video track.
                    if (videoWasMuted ||
                        currentDevices.videoinput.length >
                        availableVideoInputDevices.length) {
                        dispatch(setCameraMuted(true));
                    }
                }));

        return Promise.all(promises)
            .then(() => dispatch(deviceListChanged(devices)));
    };
}

/**
 * Action to signal that selected audio output device changed.
 *
 * @param {string} deviceId - Audio output device ID.
 * @returns {{
 *      type: AUDIO_OUTPUT_DEVICE_CHANGED,
 *      media: {
 *          audioOutput: {
 *              deviceId: string
 *          }
 *      }
 *  }}
 */
function audioOutputDeviceChanged(deviceId) {
    return {
        type: AUDIO_OUTPUT_DEVICE_CHANGED,
        media: {
            audioOutput: {
                deviceId
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
 * Action to signal that selected camera changed.
 *
 * @param {string} deviceId - Camera device ID.
 * @returns {{
 *      type: CAMERA_DEVICE_CHANGED,
 *      media: {
 *          camera: {
 *              deviceId: string
 *          }
 *      }
 *  }}
 */
export function cameraDeviceChanged(deviceId) {
    return {
        type: CAMERA_DEVICE_CHANGED,
        media: {
            camera: {
                deviceId
            }
        }
    };
}

/**
 * Action to signal that selected microphone changed.
 *
 * @param {string} deviceId - Microphone device ID.
 * @returns {{
 *      type: MICROPHONE_DEVICE_CHANGED,
 *      media: {
 *          microphone: {
 *              deviceId: string
 *          }
 *      }
 *  }}
 */
export function microphoneDeviceChanged(deviceId) {
    return {
        type: MICROPHONE_DEVICE_CHANGED,
        media: {
            microphone: {
                deviceId
            }
        }
    };
}

/**
 * Action to signal that list of devices changed.
 *
 * @param {MediaDeviceInfo[]} devices - List of devices.
 * @returns {{
 *      type: DEVICE_LIST_CHANGED,
 *      media: {
 *          devices: MediaDeviceInfo[]
 *      }
 *  }}
 */
export function deviceListChanged(devices) {
    return {
        type: DEVICE_LIST_CHANGED,
        media: {
            devices
        }
    };
}

/**
 * Set device id of the audio output device which is currently in use.
 *
 * @param {string} newId='default' - new audio output device id
 * @returns {Promise}
 */
export function setAudioOutputDevice(newId = 'default') {
    return dispatch => {
        return JitsiMeetJS.mediaDevices.setAudioOutputDevice(newId)
            .then(() => dispatch(audioOutputDeviceChanged(newId)));
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
    return (dispatch, getState) => {
        let muted = getState()['features/base/media'].microphone.muted;

        return dispatch(setMicrophoneMuted(!muted));
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
 * Inits list of current devices and event listener for device change.
 *
 * @returns {Function}
 */
export function initDeviceList() {
    return (dispatch, getState) => {
        JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
            let tracks = getState()['features/base/tracks'];
            let localAudio = tracks.find(t => t.isLocal() && t.isAudioTrack());
            let localVideo = tracks.find(t => t.isLocal() && t.isVideoTrack());

            // Ugly way to synchronize real device IDs with local
            // storage and settings menu. This is a workaround until
            // getConstraints() method will be implemented in browsers.
            if (localAudio) {
                localAudio._setRealDeviceIdFromDeviceList(devices);
                dispatch(microphoneDeviceChanged(localAudio.getDeviceId()));
            }

            if (localVideo) {
                localVideo._setRealDeviceIdFromDeviceList(devices);
                dispatch(cameraDeviceChanged(localVideo.getDeviceId()));
            }

            dispatch(deviceListChanged(devices));
        });

        JitsiMeetJS.mediaDevices.addEventListener(
            JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
            (devices) =>
                window.setTimeout(
                    () => dispatch(onDeviceListChanged(devices)), 0));
    };
}