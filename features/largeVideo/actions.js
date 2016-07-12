import { ON_STAGE_PARTICIPANT_CHANGED } from './actionTypes';
import './middleware';
import './reducer';

/**
 * Action to select participant on stage based on variety of factors: if there
 * is a dominant or pinned speaker, or if there are remote tracks etc.
 *
 * @returns {Function}
 */
export function selectParticipantOnStage() {
    return (dispatch, getState) => {
        let state = getState();
        let conference = state['features/base/conference'];
        let largeVideo = state['features/largeVideo'];
        let participants = state['features/base/participants'];
        let tracks = state['features/base/tracks'];

        let onStageParticipant = getOnStageParticipant(participants, tracks);
        let onStageParticipantId = onStageParticipant
            ? onStageParticipant.id
            : undefined;

        if (onStageParticipantId !== largeVideo.onStageParticipantId) {
            dispatch({
                type: ON_STAGE_PARTICIPANT_CHANGED,
                largeVideo: {
                    onStageParticipantId: onStageParticipantId
                }
            });

            dispatch(selectEndpoint());
        }
    };
}

/**
 * Signals conference to select an endpoint.
 *
 * @returns {Function}
 */
export function selectEndpoint() {
    return (dispatch, getState) => {
        let state = getState();
        let conference = state['features/base/conference'];
        let largeVideo = state['features/largeVideo'];
        let participants = state['features/base/participants'];
        let tracks = state['features/base/tracks'];

        if (conference) {
            let onStageParticipant = participants
                .find(p => p.id === largeVideo.onStageParticipantId);
            let videoTrack = getVideoTrack(onStageParticipant, tracks);

            if (videoTrack && videoTrack.videoType === 'camera') {
                conference.selectParticipant(largeVideo.onStageParticipantId);
            } else {
                conference.selectParticipant(null);
            }
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
 * Returns on stage participant.
 *
 * @param {Participant[]} participants - All participants.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - All tracks.
 * @returns {(Participant|undefined)}
 */
function getOnStageParticipant(participants, tracks) {
    // First get the pinned participant. If local participant is pinned, it will
    // be shown on stage.
    let onStageParticipant = participants.find(p => p.pinned);

    // If no participant is pinned, get the dominant speaker. But local
    // participant won't be on stage even if he is dominant speaker.
    if (!onStageParticipant) {
        onStageParticipant = participants.find(p => p.speaking && !p.local);
    }

    // If no participant is pinned and no dominant speaker, just get the
    // participant with last visible video track. This may turn out ot be local
    // participant.
    if (!onStageParticipant) {
        let videoTrack = electLastVisibleVideo(tracks);
        onStageParticipant = getParticipantByVideoTrack(
            videoTrack, participants);
    }

    return onStageParticipant;
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

/**
 * Returns video track for a specified participant.
 *
 * @param {Participant|undefined} participant - Participant object.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - List of all tracks.
 * @returns {(JitsiLocalTrack|JitsiRemoteTrack|undefined)}
 */
function getVideoTrack(participant, tracks) {
    if (!participant) {
        return;
    }

    return tracks.find(t => {
        return t.isVideoTrack() &&
            ((participant.local && t.isLocal()) ||
            (!participant.local && !t.isLocal() &&
            t.getParticipantId() === participant.id));
    });
}