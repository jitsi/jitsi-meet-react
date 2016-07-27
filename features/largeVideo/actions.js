import {
    MEDIA_TYPE,
    VIDEO_TYPE
} from '../base/tracks';

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
        let conference = state['features/base/conference'];

        if (conference) {
            let largeVideo = state['features/largeVideo'];
            let tracks = state['features/base/tracks'];

            let videoTrack = tracks.find(
                t => (
                    t.participantId === largeVideo.participantId
                    && t.mediaType === MEDIA_TYPE.VIDEO
                )
            );

            conference.selectParticipant(
                (videoTrack && videoTrack.videoType === VIDEO_TYPE.CAMERA)
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

        let participantId = electParticipantInLargeVideo(participants, tracks);

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
 * @param {Track[]} tracks - All current tracks.
 * @returns {(Track|undefined)}
 */
function electLastVisibleVideo(tracks) {
    let videoTrack;

    // First we try to get most recent remote video track.
    for (let i = tracks.length - 1; i >= 0; i--) {
        if (tracks[i].mediaType === MEDIA_TYPE.VIDEO && !tracks[i].local) {
            videoTrack = tracks[i];
            break;
        }
    }

    // And if no remote video tracks are available, we select the local one.
    if (!videoTrack) {
        videoTrack = tracks.find(
            t => t.local && t.mediaType === MEDIA_TYPE.VIDEO);
    }

    return videoTrack;
}

/**
 * Returns the participant ID who is to be on the stage i.e. should be displayed
 * in LargeVideo.
 *
 * @param {Participant[]} participants - All participants.
 * @param {Track[]} tracks - All tracks.
 * @returns {(string|undefined)}
 */
function electParticipantInLargeVideo(participants, tracks) {
    // First get the pinned participant. If local participant is pinned, he
    // will be shown in LargeVideo.
    let participantId = (participants.find(p => p.pinned) || {}).id;

    // If no participant is pinned, get the dominant speaker. But local
    // participant won't be displayed in LargeVideo even if he is the dominant
    // speaker.
    if (!participantId) {
        participantId =
            (participants.find(p => p.speaking && !p.local) || {}).id;
    }

    // If no participant is pinned and no dominant speaker, just get the
    // participant with last visible video track. This may turn out to be local
    // participant.
    if (!participantId) {
        let videoTrack = electLastVisibleVideo(tracks);
        participantId = videoTrack && videoTrack.participantId;
    }

    return participantId;
}