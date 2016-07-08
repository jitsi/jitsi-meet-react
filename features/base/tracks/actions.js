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

const TrackErrors = JitsiMeetJS.errors.track;

/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {void}
 */
export function addTracksToConference(conference, localTracks) {
    let conferenceLocalTracks = conference.getLocalTracks();
    for (let track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (-1 === conferenceLocalTracks.indexOf(track)) {
            conference.addTrack(track);
        }
    }
}

/**
 * Calls JitsiLocalTrack#dispose() on all local tracks ignoring errors when
 * track is already disposed.
 *
 * @returns {Function}
 */
export function disposeLocalTracks() {
    return (dispatch, getState) => {
        const tracks = getState()['features/base/tracks'];
        
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
    };
}

/**
 * Add new local tracks to the conference, replacing any existing tracks that
 * were previously attached.
 *
 * @param {JitsiLocalTrack[]} [newLocalTracks=[]] - List of new local media
 * tracks.
 * @returns {Function}
 */
export function changeLocalTracks(newLocalTracks = []) {
    return (dispatch, getState) => {
        const conference = getState()['features/base/conference'];
        let tracksToAdd = [];
        let tracksToRemove = [];
        let newAudioTrack;
        let newVideoTrack;
        let promise = Promise.resolve();

        if (conference) {
            conference.getLocalTracks().forEach(track => {
                if (track.isAudioTrack()) {
                    newAudioTrack = newLocalTracks.find(t => t.isAudioTrack());

                    if (newAudioTrack) {
                        tracksToAdd.push(newAudioTrack);
                        tracksToRemove.push(track);
                    }
                } else if (track.isVideoTrack()) {
                    newVideoTrack = newLocalTracks.find(t => t.isVideoTrack());

                    if (newVideoTrack) {
                        tracksToAdd.push(newVideoTrack);
                        tracksToRemove.push(track);
                    }
                }
            });

            // TODO: add various checks from original useVideo/AudioStream

            promise = Promise.all(tracksToRemove.map(t => t.dispose()))
                .then(() => Promise.all(
                    tracksToRemove.map(t => dispatch(trackRemoved(t)))))
                .then(() => addTracksToConference(conference, tracksToAdd));
        } else {
            tracksToAdd = newLocalTracks;
        }

        return promise
            .then(() => Promise.all(
                tracksToAdd.map(t => dispatch(trackAdded(t)))))
            .then(() => {
                // Maybe update local participant's videoType after we received
                // new media tracks.
                let participants = getState()['features/base/participants'];
                let localParticipant = participants.find(p => p.local);
                let promise = Promise.resolve();
                let addedVideoTrack = tracksToAdd.find(t => t.isVideoTrack());
                let removedVideoTrack = tracksToRemove
                    .find(t => t.isVideoTrack());

                if (localParticipant) {
                    if (addedVideoTrack) {
                        promise = dispatch(participantVideoTypeChanged(
                            localParticipant.id,
                            addedVideoTrack.videoType));
                    } else if (removedVideoTrack) {
                        promise = dispatch(participantVideoTypeChanged(
                            localParticipant.id,
                            undefined));
                    }
                }

                return promise;
            });
    };
}

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
            return dispatch(changeLocalTracks(localTracks));
        }).catch(reason => {
            console.error(
                'JitsiMeetJS.createLocalTracks.catch rejection reason: '
                + reason);
        });
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
 * Create an action for when a track has been signaled for
 * removal from the conference.
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