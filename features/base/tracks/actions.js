import JitsiMeetJS from '../lib-jitsi-meet';

import {
    participantVideoTypeChanged
} from '../../base/participants';

import {
    TRACK_ADDED,
    TRACK_MUTE_CHANGED,
    TRACK_REMOVED
} from './actionTypes';
import './reducer';

const JitsiTrackErrors = JitsiMeetJS.errors.track;

/**
 * Request to start capturing local audio and/or video. By default, the user
 * facing camera will be selected.
 *
 * @param {Object} [options] - For info @see JitsiMeetJS.createLocalTracks.
 * @returns {Function}
 */
export function createLocalTracks(options) {
    options || (options = {});
    return dispatch => {
        return JitsiMeetJS.createLocalTracks({
            devices: options.devices || ['audio', 'video'],
            facingMode: options.facingMode || 'user',
            cameraDeviceId: options.cameraDeviceId,
            micDeviceId: options.micDeviceId
        }).then(localTracks => {
            return dispatch(_updateLocalTracks(localTracks));
        }).catch(reason => {
            console.error(
                'JitsiMeetJS.createLocalTracks.catch rejection reason: '
                + reason);
        });
    };
}

/**
 * Calls JitsiLocalTrack#dispose() on all local tracks ignoring errors when
 * track is already disposed. After that signals tracks to be removed.
 *
 * @returns {Function}
 */
export function destroyLocalTracks() {
    return (dispatch, getState) => {
        return dispatch(_disposeAndRemoveTracks(
            getState()['features/base/tracks'].filter(t => t.isLocal())));
    };
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
 * @returns {{ type: TRACK_MUTE_CHANGED, track: JitsiTrack }}
 */
export function trackMuteChanged(track) {
    return {
        type: TRACK_MUTE_CHANGED,
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
 * Signals passed tracks to be added.
 *
 * @param {JitsiTrack[]} tracks - List of tracks.
 * @private
 * @returns {Function}
 */
function _addTracks(tracks) {
    return dispatch => {
        return Promise.all(tracks.map(t => dispatch(trackAdded(t))));
    };
}

/**
 * Disposes passed tracks and signals them to be removed.
 *
 * @param {JitsiTrack[]} tracks - List of tracks.
 * @private
 * @returns {Function}
 */
function _disposeAndRemoveTracks(tracks) {
    return dispatch => {
        return Promise.all(
            tracks.map(t => {
                return t.dispose()
                    .catch(err => {
                        // Track might be already disposed so ignore such an
                        // error. Of course, re-throw any other error(s).
                        if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                            throw err;
                        }
                    });
            }))
            .then(Promise.all(tracks.map(t => dispatch(trackRemoved(t)))));
    };
}

/**
 * Determines which local media tracks should be added, and which - removed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} currentTracks - List of
 * existing media tracks.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} newTracks - List of new media
 * tracks.
 * @private
 * @returns {{
 *      tracksToAdd: JitsiLocalTrack[],
 *      tracksToRemove: JitsiLocalTrack[]
 * }}
 */
function _getLocalTracksToChange(currentTracks, newTracks) {
    let currentLocalAudio = currentTracks.find(
        t => t.isLocal() && t.isAudioTrack());
    let currentLocalVideo = currentTracks.find(
        t => t.isLocal() && t.isVideoTrack());
    let newLocalAudio = newTracks.find(
        t => t.isLocal() && t.isAudioTrack());
    let newLocalVideo = newTracks.find(
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

    return {
        tracksToAdd,
        tracksToRemove
    };
}

/**
 * Set new local tracks replacing any existing tracks that were previously
 * available. Currently only one audio and one video local tracks are allowed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} [newTracks=[]] - List of new
 * media tracks.
 * @returns {Function}
 */
function _updateLocalTracks(newTracks = []) {
    return (dispatch, getState) => {
        let tracks = getState()['features/base/tracks'];
        let { tracksToAdd, tracksToRemove } =
            _getLocalTracksToChange(tracks, newTracks);

        return dispatch(_disposeAndRemoveTracks(tracksToRemove))
            .then(() => dispatch(_addTracks(tracksToAdd)))
            .then(() => {
                // Maybe update local participant's videoType after we received
                // new media tracks.

                // FIXME Lyubomir Marinov: It doesn't sound right to me to have
                // tracks trying to figure out & trigger participant-related
                // events. A participant owns tracks so it appears natural to me
                // to have the participant keep an eye on its tracks & determine
                // whether its video type has changed.

                let localTracks = getState()['features/base/tracks']
                    .filter(t => t.isLocal());
                let localParticipant = getState()['features/base/participants']
                    .find(p => p.local);
                let localVideo = tracks.find(t => t.isVideoTrack());

                if (localParticipant) {
                    dispatch(participantVideoTypeChanged(
                        localParticipant.id,
                        localVideo ? localVideo.videoType : undefined));
                }

                return Promise.resolve(localTracks);
            });
    };
}