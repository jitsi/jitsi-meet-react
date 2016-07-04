import { createLocalTracks } from '../base/tracks';
import { leaveConference } from '../conference';
import { disconnectConnection } from '../connection';

import {
    CHANGE_CAMERA_FACING_MODE,
    RESET_TOOLBAR,
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE
} from './actionTypes';
import './reducer';

/**
 * Camera facing modes.
 * @enum {string}
 */
const CAMERA_FACING_MODE = {
    ENVIRONMENT: 'environment',
    USER: 'user'
};

/**
 * Media types.
 * @enum {string}
 */
const MEDIA_TYPE = {
    VIDEO: 'video',
    AUDIO: 'audio'
};

/**
 * Leaves the conference and closes the connection.
 *
 * @returns {Function}
 */
export function hangup() {
    return dispatch => {
        return dispatch(leaveConference())
            .then(() => dispatch(disconnectConnection()));
    };
}

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
        const stateFeaturesTracks = getState()['features/base/tracks'];
        const localTracks = stateFeaturesTracks.filter(t => t.isLocal());
        for (let track of localTracks) {
            const type = track.getType();
            if (type !== media) {
                continue;
            }
            if (track.isMuted()) {
                track.unmute();
            } else {
                track.mute();
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

/**
 * Resets toolbar to initial state.
 *
 * @returns {{type: RESET_TOOLBAR}}
 */
export function resetToolbar() {
    return {
        type: RESET_TOOLBAR
    };
}
