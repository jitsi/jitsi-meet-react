import { ReducerRegistry } from '../redux';

import {
    AUDIO_OUTPUT_DEVICE_CHANGED,
    CAMERA_DEVICE_CHANGED,
    CAMERA_DISABLED_STATE_CHANGED,
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    DEVICE_LIST_CHANGED,
    MEDIA_RESET,
    MICROPHONE_DEVICE_CHANGED,
    MICROPHONE_DISABLED_STATE_CHANGED,
    MICROPHONE_MUTED_STATE_CHANGED
} from './actionTypes';

import { CAMERA_FACING_MODE } from './constants';

/**
 * Media state object.
 *
 * @typedef {Object} MediaState
 *
 * @property {Object} audioOutput - Audio output device information.
 * @property {string} audioOutput.deviceId='' - ID of current audio output
 *      device.
 *
 * @property {Object} camera - camera device information.
 * @property {string} camera.deviceId='' - ID of current camera.
 * @property {boolean} camera.disabled=false - If camera is disabled.
 * @property {CAMERA_FACING_MODE} camera.facingMode='user' - Camera facing mode.
 * @property {boolean} camera.muted='user' - Camera facing mode.
 *
 * @property {MediaDeviceInfo[]} devices=[] - List of available media devices.
 *
 * @property {Object} microphone - microphone device information.
 * @property {string} microphone.deviceId='' - ID of current microphone.
 * @property {boolean} microphone.disabled=false - If microphone is disabled.
 * @property {boolean} microphone.muted=false - If microphone is muted.
 */

/**
 * Initial state.
 *
 * @type {MediaState}
 */
const INITIAL_STATE = {
    audioOutput: {
        deviceId: 'default'
    },
    camera: {
        deviceId: '',
        disabled: false,
        facingMode: CAMERA_FACING_MODE.USER,
        muted: false
    },
    devices: [],
    microphone: {
        deviceId: '',
        disabled: false,
        muted: false
    }
};

/**
 * Listen for various actions related to media devices.
 *
 * @param {Object} state - State of media devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Object} action.media - Information about media devices to be
 *      modified.
 * @returns {Object}
 */
ReducerRegistry.register('features/base/media',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case AUDIO_OUTPUT_DEVICE_CHANGED:
            return {
                ...state,
                audioOutput: {
                    ...state.audioOutput,
                    deviceId: action.media.audioOutput.deviceId
                }
            };

        case CAMERA_DEVICE_CHANGED:
            return {
                ...state,
                camera: {
                    ...state.camera,
                    deviceId: action.media.camera.deviceId
                }
            };

        case CAMERA_DISABLED_STATE_CHANGED:
            return {
                ...state,
                camera: {
                    ...state.camera,
                    disabled: action.media.camera.disabled
                }
            };

        case CAMERA_FACING_MODE_CHANGED:
            return {
                ...state,
                camera: {
                    ...state.camera,
                    facingMode: action.media.camera.facingMode
                }
            };

        case CAMERA_MUTED_STATE_CHANGED:
            return {
                ...state,
                camera: {
                    ...state.camera,
                    muted: action.media.camera.muted
                }
            };

        case DEVICE_LIST_CHANGED:
            return {
                ...state,
                devices: action.media.devices.slice(0)
            };

        case MEDIA_RESET:
            return INITIAL_STATE;

        case MICROPHONE_DEVICE_CHANGED:
            return {
                ...state,
                microphone: {
                    ...state.microphone,
                    deviceId: action.media.microphone.deviceId
                }
            };

        case MICROPHONE_DISABLED_STATE_CHANGED:
            return {
                ...state,
                microphone: {
                    ...state.microphone,
                    disabled: action.media.microphone.disabled
                }
            };

        case MICROPHONE_MUTED_STATE_CHANGED:
            return {
                ...state,
                microphone: {
                    ...state.microphone,
                    muted: action.media.microphone.muted
                }
            };

        default:
            return state;
        }
    });