import JitsiMeetJS from 'lib-jitsi-meet';


import {
    REMOTE_TRACK_ADDED,
    LOCAL_TRACKS_ADDED,
    TOGGLE_AUDIO,
    TOGGLE_VIDEO
} from '../constants';


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
 * Toggle the mute state of the local tracks with the given media type.
 */
function toggleMedia(media) {
    return (dispatch, getState) => {
        const localTracks = getState().localTracks;
        for (let track of localTracks) {
            console.log(track.getType(), '==?', media);
            if (track.getType() !== media) {
                continue;
            }
            if (track.isMuted()) {
                track.unmute();
            } else {
                track.mute();
            }
        }

        dispatch({
            type: media === 'video' ? TOGGLE_VIDEO : TOGGLE_AUDIO
        });
    };
}

/**
 * Toggle the mute state of the local audio track.
 */
export function toggleAudio() {
    return toggleMedia('audio');
}

/**
 * Toggle the mute state of the local video track;
 */
export function toggleVideo() {
    return toggleMedia('video');
}

/**
 * Create an action for when a new track has been signaled to be added
 * to the conference.
 */
export function remoteTrackAdded(track) {
    return {
        type: REMOTE_TRACK_ADDED,
        track
    };
}

/**
 * Create an action for when a remote track has been signaled for
 * removal from the conference.
 */
export function remoteTrackRemoved(track) {
    return {
        type: REMOTE_TRACK_REMOVED,
        track
    };
}

/**
 * Request to start capturing local audio and video.
 * 
 * By default, the user facing camera will be selected.
 */
export function startLocalTracks(facingMode) {
    return (dispatch, getState) => {
        return JitsiMeetJS.createLocalTracks({
            devices: ['audio', 'video'],
            facingMode: facingMode || 'user'
        }).then(localTracks => {
            return dispatch(localTracksAdded(localTracks));
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
 */
export function localTracksAdded(localTracks) {
    return (dispatch, getState) => {
        const conference = getState().client.conference;
        if (conference) {
            Promise.all(
                conference.getLocalTracks()
                    .map(t => conference.removeTrack(t))
            ).then(() => {
                addTracksToConference(conference, localTracks)
            });
        }

        dispatch({
            type: LOCAL_TRACKS_ADDED,
            tracks: localTracks
        });
    };
}
