import JitsiMeetJS from '../base/lib-jitsi-meet';

import { createLocalTracks } from '../base/tracks';

import {
    CHANGE_CAMERA_FACING_MODE,
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

const TrackErrors = JitsiMeetJS.errors.track;

/**
 * Calls JitsiLocalTrack#dispose() on all local tracks ignoring errors when
 * track is already disposed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - All tracks.
 * @private
 * @returns {Promise}
 */
function disposeLocalTracks(tracks) {
    return Promise.all(
        tracks
            .filter(t => t.isLocal())
            .map(t => {
                return t.dispose()
                    .catch(err => {
                        // Track might be already disposed, so we ignore
                        // this error, but re-throw error in other cases.
                        if (err.name !== TrackErrors.TRACK_IS_DISPOSED) {
                            throw err;
                        }
                    });
            }));
}

/**
 * Leaves the conference and closes the connection.
 *
 * @returns {Function}
 */
export function hangup() {
    return (dispatch, getState) => {
        const state = getState();
        const tracks = state['features/base/tracks'];
        const conference = state['features/base/conference'];
        const connection = state['features/base/connection'];
        
        let promise = Promise.resolve();

        if (conference) {
            promise = promise
                .then(() => conference.leave());
        }

        promise = promise
            .then(() => disposeLocalTracks(tracks));

        if (connection) {
            promise = promise
                .then(() => connection.disconnect());
        }

        return promise;
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