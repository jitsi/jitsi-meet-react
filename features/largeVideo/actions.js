import { getVideoTrack } from '../base/tracks';

import { LARGE_VIDEO_PARTICIPANT_CHANGED } from './actionTypes';
import './middleware';
import './reducer';

/**
 * Signals conference to select an endpoint.
 *
 * @returns {Function}
 */
export function selectEndpoint() {
    return (dispatch, getState) => {
        let state = getState();
        let conference = state['features/base/conference'].jitsiConference;

        if (conference) {
            let participants = state['features/base/participants'];
            let largeVideo = state['features/largeVideo'];
            let tracks = state['features/base/tracks'];

            let participant =
                participants.find(p => p.id === largeVideo.participantId);
            let videoTrack = getVideoTrack(participant, tracks);

            conference.selectParticipant(
                (videoTrack && videoTrack.videoType === 'camera')
                    ? largeVideo.participantId
                    : null);
        }
    };
}

/**
 * Action to select the participant to be displayed in LargeVideo based on a
 * variety of factors: if there is a dominant or pinned speaker, or if there are
 * remote tracks etc.
 *
 * @returns {Function}
 */
export function selectParticipantInLargeVideo() {
    return (dispatch, getState) => {
        let state = getState();
        let participants = state['features/base/participants'];
        let tracks = state['features/base/tracks'];
        let largeVideo = state['features/largeVideo'];

        let participant = electParticipantInLargeVideo(participants, tracks);
        let participantId = participant ? participant.id : undefined;

        if (participantId !== largeVideo.participantId) {
            dispatch({
                type: LARGE_VIDEO_PARTICIPANT_CHANGED,
                participantId
            });

            dispatch(selectEndpoint());
        }
    };
}

/**
 * Returns the most recent existing video track. It can be local or remote
 * video.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - All current tracks.
 * @returns {(JitsiLocalTrack|JitsiRemoteTrack|undefined)}
 */
function electLastVisibleVideo(tracks) {
    let videoTrack;

    // First we try to get most recent remote video track.
    for (let i = tracks.length - 1; i >= 0; i--) {
        if (tracks[i].isVideoTrack() && !tracks[i].isLocal()) {
            videoTrack = tracks[i];
            break;
        }
    }

    // And if no remote video tracks are available, we select the local one.
    if (!videoTrack) {
        videoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());
    }

    return videoTrack;
}

/**
 * Returns the participant who is to be on the stage i.e. should be displayed
 * in LargeVideo.
 *
 * @param {Participant[]} participants - All participants.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - All tracks.
 * @returns {(Participant|undefined)}
 */
function electParticipantInLargeVideo(participants, tracks) {
    // First get the pinned participant. If local participant is pinned, she
    // will be shown in LargeVideo.
    let participant = participants.find(p => p.pinned);

    // If no participant is pinned, get the dominant speaker. But local
    // participant won't be displayed in LargeVideo even if she is the dominant
    // speaker.
    if (!participant) {
        participant = participants.find(p => p.speaking && !p.local);
    }

    // If no participant is pinned and no dominant speaker, just get the
    // participant with last visible video track. This may turn out to be local
    // participant.
    if (!participant) {
        let videoTrack = electLastVisibleVideo(tracks);
        participant = getParticipantByVideoTrack(videoTrack, participants);
    }

    return participant;
}

/**
 * Returns participant corresponding to video stream.
 *
 * @param {JitsiLocalTrack|JitsiRemoteTrack} track - Current video track.
 * @param {Participant[]} participants - List of all participants.
 * @returns {(Participant|undefined)}
 */
function getParticipantByVideoTrack(track, participants) {
    if (!track) {
        return;
    }

    return track.isLocal()
        ? participants.find(p => p.local)
        : participants.find(p => p.id === track.getParticipantId());
}
