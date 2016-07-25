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
 * Add new local tracks to the conference, replacing any existing tracks that
 * were previously attached.
 *
 * @param {JitsiLocalTrack[]} [newLocalTracks=[]] - List of new local media
 * tracks.
 * @returns {Function}
 */
export function changeLocalTracks(newLocalTracks = []) {
    return (dispatch, getState) => {
        const conference =
            getState()['features/base/conference'].jitsiConference;
        let tracksToAdd = [];
        let tracksToRemove = [];
        let promise = Promise.resolve();

        if (conference) {
            conference.getLocalTracks().forEach(track => {
                let type = track.getType();

                if (type) {
                    let newTrack =
                        newLocalTracks.find(t => (t.getType() === type));

                    if (newTrack) {
                        tracksToAdd.push(newTrack);
                        tracksToRemove.push(track);
                    }
                }
            });

            // TODO: add various checks from original useVideo/AudioStream

            promise = dispatch(_disposeAndRemoveTracks(tracksToRemove))
                .then(() => addTracksToConference(conference, tracksToAdd));
        } else {
            tracksToAdd = newLocalTracks;
        }

        return promise
            .then(() => Promise.all(
                tracksToAdd.map(t => dispatch(trackAdded(t)))))
            .then(() => {
                // FIXME Lyubomir Marinov: It doesn't sound right to me to have
                // tracks trying to figure out & trigger participant-related
                // events. A participant owns tracks so it appears natural to me
                // to have the participant keep an eye on its tracks & determine
                // whether its video type has changed.

                // Maybe update local participant's videoType after we received
                // new media tracks.
                let participants = getState()['features/base/participants'];
                let localParticipant = participants.find(p => p.local);
                let promise = Promise.resolve();

                if (localParticipant) {
                    let addedVideoTrack =
                        tracksToAdd.find(t => t.isVideoTrack());
                    let removedVideoTrack =
                        tracksToRemove.find(t => t.isVideoTrack());

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
 * Disposes passed tracks and signals them to be removed.
 *
 * @param {JitsiTrack[]} tracks - List of tracks.
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
