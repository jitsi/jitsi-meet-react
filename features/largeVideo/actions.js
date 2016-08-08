import {
    MEDIA_TYPE,
    VIDEO_TYPE
} from '../base/media';
import {
    getLocalVideoTrack,
    getTrackByMediaTypeAndParticipant
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
        const state = getState();
        const conference = state['features/base/conference'].jitsiConference;

        if (conference) {
            const largeVideo = state['features/largeVideo'];
            const tracks = state['features/base/tracks'];

            const videoTrack = getTrackByMediaTypeAndParticipant(
                tracks, MEDIA_TYPE.VIDEO, largeVideo.participantId);

            conference.selectParticipant(
                videoTrack && videoTrack.videoType === VIDEO_TYPE.CAMERA
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
        const state = getState();
        const participants = state['features/base/participants'];
        const tracks = state['features/base/tracks'];
        const largeVideo = state['features/largeVideo'];
        const participantId
            = electParticipantInLargeVideo(participants, tracks);

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
        videoTrack = getLocalVideoTrack(tracks);
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
    // First get the pinned participant. If local participant is pinned, he will
    // be shown in LargeVideo.
    let participant = participants.find(p => p.pinned);
    let id = participant ? participant.id : undefined;

    // If no participant is pinned, get the dominant speaker. But local
    // participant won't be displayed in LargeVideo even if he is the dominant
    // speaker.
    if (!id) {
        participant = participants.find(p => p.speaking && !p.local);
        if (participant) {
            id = participant.id;
        }
    }

    // If no participant is pinned and no dominant speaker, just get the
    // participant with last visible video track. This may turn out to be local
    // participant.
    if (!id) {
        const videoTrack = electLastVisibleVideo(tracks);

        id = videoTrack && videoTrack.participantId;
    }

    return id;
}
