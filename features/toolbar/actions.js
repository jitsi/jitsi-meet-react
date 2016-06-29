import { createLocalTracks } from '../base/tracks';

import {
    CHANGE_CAMERA_FACING_MODE,
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE
} from './actionTypes';
import './reducer';

const CAMERA_FACING_MODE = {
    ENVIRONMENT: 'environment',
    USER: 'user'
};

/**
 * Leaves the conference and closes the connection.
 */
export function hangup() {
    return (dispatch, getState) => {
        const state = getState();
        const stateFeaturesWelcome = state['features/welcome'];
        const conference = stateFeaturesWelcome.conference;
        const connection = stateFeaturesWelcome.connection;

        if (conference) {
            conference.leave()
                .then(() => connection.disconnect());
        } else if (connection) {
            connection.disconnect();
        }
    };
}

/**
 * Toggles the mute state of the local audio track(s).
 */
export function toggleAudio() {
    return toggleMedia('audio');
}

/**
 * Toggles the camera between front and rear (user and environment).
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
                    devices: ['video'],
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
            type: media === 'video'
                ? TOGGLE_VIDEO_MUTED_STATE
                : TOGGLE_AUDIO_MUTED_STATE
        });
    };
}

/**
 * Toggles the mute state of the local video track(s).
 */
export function toggleVideo() {
    return toggleMedia('video');
}
