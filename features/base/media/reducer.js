import { combineReducers } from 'redux';

import { ReducerRegistry } from '../redux';

import {
    CAMERA_FACING_MODE_CHANGED,
    VIDEO_MUTED_STATE_CHANGED,
    AUDIO_MUTED_STATE_CHANGED
} from './actionTypes';

import { CAMERA_FACING_MODE } from './constants';

/**
 * Media state object for local audio.
 *
 * @typedef {Object} AudioMediaState
 * @property {boolean} muted=false - Audio muted state.
 */

/**
 * Initial state for local audio.
 *
 * @type {AudioMediaState}
 */
const AUDIO_INITIAL_MEDIA_STATE = {
    muted: false
};

/**
 * Reducer for audio media state.
 *
 * @param {AudioMediaState} state - Media state of local audio.
 * @param {Object} action - Action object.
 * @param {Object} action.media - Media state object.
 * @param {AudioMediaState} action.media.audio - Media state of local audio.
 * @param {string} action.type - Type of action.
 * @returns {AudioMediaState}
 */
const audio = (state = AUDIO_INITIAL_MEDIA_STATE, action) => {
    switch (action.type) {
    case AUDIO_MUTED_STATE_CHANGED:
        return {
            ...state,
            muted: action.media.audio.muted
        };

    default:
        return state;
    }
};

/**
 * Media state object for local video.
 *
 * @typedef {Object} VideoMediaState
 * @property {CAMERA_FACING_MODE} facingMode='user' - Camera facing mode.
 * @property {boolean} muted=false - Video muted state.
 */

/**
 * Initial state for video.
 *
 * @type {VideoMediaState}
 */
const VIDEO_INITIAL_MEDIA_STATE = {
    facingMode: CAMERA_FACING_MODE.USER,
    muted: false
};

/**
 * Reducer for camera media state.
 *
 * @param {VideoMediaState} state - Media state of local video.
 * @param {Object} action - Action object.
 * @param {Object} action.media - Media state object.
 * @param {VideoMediaState} action.media.video - Media state of video.
 * @param {string} action.type - Type of action.
 * @returns {VideoMediaState}
 */
const video = (state = VIDEO_INITIAL_MEDIA_STATE, action) => {
    switch (action.type) {
    case CAMERA_FACING_MODE_CHANGED:
        return {
            ...state,
            facingMode: action.media.video.facingMode
        };

    case VIDEO_MUTED_STATE_CHANGED:
        return {
            ...state,
            muted: action.media.video.muted
        };

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
    audio,
    video
}));
