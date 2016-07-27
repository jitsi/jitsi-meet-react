import { combineReducers } from 'redux';

import { CONFERENCE_LEFT } from '../conference';
import { ReducerRegistry } from '../redux';

import {
    CAMERA_FACING_MODE_CHANGED,
    CAMERA_MUTED_STATE_CHANGED,
    MICROPHONE_MUTED_STATE_CHANGED
} from './actionTypes';

import { CAMERA_FACING_MODE } from './constants';

/**
 * Media state object for camera.
 *
 * @typedef {Object} CameraMediaState
 * @property {CAMERA_FACING_MODE} facingMode='user' - Camera facing mode.
 * @property {boolean} muted=false - Camera muted state.
 */

/**
 * Initial state for camera.
 *
 * @type {CameraMediaState}
 */
const CAMERA_INITIAL_STATE = {
    facingMode: CAMERA_FACING_MODE.USER,
    muted: false
};

/**
 * Reducer for camera media state.
 *
 * @param {CameraMediaState} state - Media state of camera.
 * @param {Object} action - Action object.
 * @param {Object} action.media - Media state object.
 * @param {CameraMediaState} action.media.camera - Media state of camera.
 * @param {string} action.type - Type of action.
 * @returns {CameraMediaState}
 */
const camera = (state = CAMERA_INITIAL_STATE, action) => {
    switch(action.type) {
    case CAMERA_FACING_MODE_CHANGED:
        return {
            ...state,
            facingMode: action.media.camera.facingMode
        };
    case CAMERA_MUTED_STATE_CHANGED:
        return {
            ...state,
            muted: action.media.camera.muted
        };
    case CONFERENCE_LEFT:
        return CAMERA_INITIAL_STATE;
    default:
        return state;
    }
};

/**
 * Media state object for microphone.
 *
 * @typedef {Object} MicrophoneMediaState
 * @property {boolean} muted=false - Microphone muted state.
 */

/**
 * Initial state for microphone.
 *
 * @type {CameraMediaState}
 */
const MICROPHONE_INITIAL_STATE = {
    muted: false
};

/**
 * Reducer for microphone media state.
 *
 * @param {MicrophoneMediaState} state - Media state of microphone.
 * @param {Object} action - Action object.
 * @param {Object} action.media - Media state object.
 * @param {MicrophoneMediaState} action.media.microphone - Media state of
 * microphone.
 * @param {string} action.type - Type of action.
 * @returns {MicrophoneMediaState}
 */
const microphone = (state = MICROPHONE_INITIAL_STATE, action) => {
    switch(action.type) {
    case MICROPHONE_MUTED_STATE_CHANGED:
        return {
            ...state,
            muted: action.media.microphone.muted
        };
    case CONFERENCE_LEFT:
        return MICROPHONE_INITIAL_STATE;
    default:
        return state;
    }
};

/**
 * Listen for various actions related to media devices.
 *
 * @param {Object} state - State of media devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Object} action.media - Information about media devices to be
 * modified.
 * @returns {Object}
 */
ReducerRegistry.register('features/base/media', combineReducers({
    camera,
    microphone
}));