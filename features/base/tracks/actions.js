import config from '../../../config';
import JitsiMeetJS from '../lib-jitsi-meet';

import { 
    cameraDisabledStateChanged,
    cameraMutedStateChanged,
    CAMERA_FACING_MODE,
    microphoneDisabledStateChanged,
    microphoneMutedStateChanged
} from '../media';

import { participantVideoTypeChanged } from '../participants';

import {
    TRACK_ADDED,
    TRACK_REMOVED
} from './actionTypes';

import { DEVICE_TYPE } from './constants';

require('./reducer');

const JitsiTrackErrors = JitsiMeetJS.errors.track;

/**
 * Function to remove tracks that fall under specific filter condition.
 *
 * @param {Function} filter - Filtering  function, receives JitsiTrack instance
 *      as an argument.
 * @returns {Function}
 */
function removeTracks(filter) {
    return (dispatch, getState) => {
        let tracks = getState()['features/base/tracks'].filter(filter);

        return Promise.all(tracks.map(t => dispatch(removeTrack(t))));
    };
}

/**
 * Function to remove a track.
 *
 * @param {JitsiLocalTrack|JitsiRemoteTrack} track - JitsiTrack instance.
 * @returns {Function}
 */
export function removeTrack(track) {
    return dispatch => {
        let promise = Promise.resolve();

        // Dispose local track.
        if (track.isLocal()) {
            promise = track.dispose()
                .catch(err => {
                    // Track might be already disposed, so we ignore this
                    // error, but re-throw error in other cases.
                    if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                        throw err;
                    }
                });
        }

        return promise.then(() => dispatch(trackRemoved(track)));
    };
}

/**
 * Set new local tracks replacing any existing tracks that were previously
 * available. Currently only one audio and one video local tracks are allowed.
 *
 * @param {JitsiLocalTrack[]} [newLocalTracks=[]] - List of new local media
 * tracks.
 * @returns {Function}
 */
export function setLocalTracks(newLocalTracks = []) {
    return (dispatch, getState) => {
        let tracks = getState()['features/base/tracks'];
        let currentLocalAudio = tracks.find(
            t => t.isLocal() && t.isAudioTrack());
        let currentLocalVideo = tracks.find(
            t => t.isLocal() && t.isVideoTrack());
        let newLocalAudio = newLocalTracks.find(
            t => t.isLocal() && t.isAudioTrack());
        let newLocalVideo = newLocalTracks.find(
            t => t.isLocal() && t.isVideoTrack());
        let tracksToRemove = [];
        let tracksToAdd = [];

        if (newLocalAudio) {
            tracksToAdd.push(newLocalAudio);

            if (currentLocalAudio) {
                tracksToRemove.push(newLocalVideo);
            }
        }

        if (newLocalVideo) {
            tracksToAdd.push(newLocalVideo);

            if (currentLocalVideo) {
                tracksToRemove.push(currentLocalVideo);
            }
        }

        return Promise.all(tracksToRemove.map(t => dispatch(removeTrack(t))))
            .then(() =>
                Promise.all(tracksToAdd.map(t => dispatch(trackAdded(t)))))
            .then(() => {
                // This is an additional step to sync disabled and muted
                // states of tracks and media. Also update local participant's
                // videoType after we received new media tracks.

                let localTracks = getState()['features/base/tracks']
                    .filter(t => t.isLocal());
                let localParticipant = getState()['features/base/participants']
                    .find(p => p.local);
                let localAudio = localTracks.find(t => t.isAudioTrack());
                let localVideo = tracks.find(t => t.isVideoTrack());

                if (localParticipant) {
                    dispatch(participantVideoTypeChanged(
                        localParticipant.id,
                        localVideo ? localVideo.videoType : undefined));
                }

                dispatch(microphoneDisabledStateChanged(!localAudio));

                // TODO: check how this works with screen sharing
                dispatch(cameraDisabledStateChanged(!localVideo));

                dispatch(microphoneMutedStateChanged(localAudio
                    ? localAudio.isMuted()
                    : false));

                // TODO: check how this works with screen sharing
                dispatch(cameraMutedStateChanged(localVideo
                    ? localVideo.isMuted()
                    : false));

                return Promise.resolve(localTracks);
            });
    };
}

/**
 * Request to start capturing local audio and/or video. By default, the user
 * facing camera will be selected.
 *
 * @param {Object} [options] - Options.
 * @param {string[]} [options.devices=[DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO]] -
 *      Required device types ('audio', 'video' etc.).
 * @param {string|null} [options.cameraDeviceId] - Camera device id.
 * @param {string|null} [options.micDeviceId] - Microphone device id.
 * @param {string|null} [options.facingMode=CAMERA_FACING_MODE.USER] - Camera
 *      facing mode to use.
 * @param {boolean} [checkForPermissionPrompt] - If lib-jitsi-meet should check
 *      for gUM permission prompt.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
export function createLocalTracks(options, checkForPermissionPrompt) {
    options || (options = {});
    options.devices || (options.devices = [
        DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO]);

    return JitsiMeetJS.createLocalTracks({
        // copy array to avoid mutations inside library
        devices: options.devices.slice(0),
        facingMode: options.facingMode || CAMERA_FACING_MODE.USER,
        resolution: config.resolution,
        // TODO: use device IDs from settings when available
        cameraDeviceId: options.cameraDeviceId,
        micDeviceId: options.micDeviceId,
        // adds any ff fake device settings if any
        firefox_fake_device: config.firefox_fake_device
    }, checkForPermissionPrompt)
    .catch(function (err) {
        console.error('failed to create local tracks', options.devices, err);
        return Promise.reject(err);
    });
}

/**
 * Create an action for when a new track has been signaled to be added to the
 * conference.
 *
 * @param {JitsiTrack} track - JitsiTrack instance.
 * @returns {{ type: TRACK_ADDED, track: JitsiTrack }}
 */
export function trackAdded(track) {
    return {
        type: TRACK_ADDED,
        track
    };
}

/**
 * Create an action for when a track has been signaled for removal from the
 * conference.
 *
 * @param {JitsiTrack} track - JitsiTrack instance.
 * @returns {{ type: TRACK_REMOVED, track: JitsiTrack }}
 */
export function trackRemoved(track) {
    return {
        type: TRACK_REMOVED,
        track
    };
}

/**
 * Removes all remote tracks.
 *
 * @returns {Function}
 */
export function removeRemoteTracks() {
    return dispatch => dispatch(removeTracks(t => !t.isLocal()));
}

/**
 * Removes all local tracks.
 *
 * @returns {Function}
 */
export function removeLocalTracks() {
    return dispatch => dispatch(removeTracks(t => t.isLocal()));
}