require('../../polyfills');

const JitsiMeetJS = require('lib-jitsi-meet');

import {
    TRACK_ADDED,
    TRACK_REMOVED
} from './actionTypes';

/**
 * Attach a set of local tracks to a conference.
 */
export function addTracksToConference(conference, localTracks) {
    // XXX The implementation of getUserMedia provided by react-native-webrtc
    // initializes the local MediaStream instances from 1 constant label.
    // RTCPeerConnection will not add a MediaStream if a MediaStream with the same
    // label has been added already. Consequently, the second MediaStream with the
    // same label will not be streamed (to the remote endpoint). Until this issue
    // with the labels is fixed, prefer to stream the video if any and not the
    // audio MediaStream.
    for (let track of localTracks) {
        track.isVideoTrack() && conference.addTrack(track);
    }
    for (let track of localTracks) {
        track.isVideoTrack() || conference.addTrack(track);
    }
}

/**
 * Create an action for when a track has been signaled for
 * removal from the conference.
 * @param {JitsiTrack} track
 * @returns {{ type: TRACK_REMOVED, track: JitsiTrack }}
 */
export function trackRemoved(track) {
    return {
        type: TRACK_REMOVED,
        track
    };
}

/**
 * Create an action for when a new track has been signaled to be added
 * to the conference.
 * @param {JitsiTrack} track
 * @returns {{ type: TRACK_ADDED, track: JitsiTrack }}
 */
export function trackAdded(track) {
    return {
        type: TRACK_ADDED,
        track
    };
}

/**
 * Request to start capturing local audio and/or video.
 * By default, the user facing camera will be selected.
 *
 * @param {object} (options) - @see options for JitsiMeetJS.createLocalTracks
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
 * Add new local tracks to the conference, replacing any existing tracks
 * that were previously attached.
 * @param {JitsiLocalTrack[]} newLocalTracks=[]
 */
export function changeLocalTracks(newLocalTracks = []) {
    return (dispatch, getState) => {
        const conference = getState()['features/welcome'].conference;
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

        return promise.then(() =>
            Promise.all(tracksToAdd.map(t => dispatch(trackAdded(t)))));
    };
}
