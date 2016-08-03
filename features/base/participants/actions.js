import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import { LOCAL_PARTICIPANT_DEFAULT_ID } from './constants';
import './reducer';

/**
 * Action to update a participant's email.
 *
 * @param {string} id - Participant's id.
 * @param {string} email - Participant's email.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          avatar: string,
 *          email: string
 *      }
 * }}
 */
export function changeParticipantEmail(id, email) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            email
        }
    };
}

/**
 * Create an action for when dominant speaker changes.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: DOMINANT_SPEAKER_CHANGED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id
        }
    };
}

/**
 * Action to create a local participant.
 *
 * @param {Object} [participant={}] - Additional information about participant.
 * @param {string} [participant.id=LOCAL_PARTICIPANT_DEFAULT_ID] - Participant's
 * id.
 * @param {string} [participant.displayName='me'] - Participant's display name.
 * @param {string} [participant.avatar=''] - Participant's avatar.
 * @param {string} [participant.role='none'] - Participant's role.
 * @returns {Function}
 */
export function localParticipantJoined(participant = {}) {
    return (dispatch, getState) => {
        // Local media tracks might be created already by this moment, so we try
        // to take videoType from current video track.
        let tracks = getState()['features/base/tracks'];
        let id = participant.id || LOCAL_PARTICIPANT_DEFAULT_ID;
        let localVideoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());

        return dispatch({
            type: PARTICIPANT_JOINED,
            participant: {
                id,
                avatar: participant.avatar,
                email: participant.email,
                local: true,
                name: participant.displayName || 'me',
                role: participant.role,
                videoType: localVideoTrack
                    ? localVideoTrack.videoType
                    : undefined
            }
        });
    };
}

/**
 * Action to remove a local participant.
 *
 * @returns {Function}
 */
export function localParticipantLeft() {
    return (dispatch, getState) => {
        let participant = getState()['features/base/participants']
            .find(p => p.local);

        if (participant) {
            return dispatch(participantLeft(participant.id));
        }
    };
}

/**
 * Action to handle case when participant lefts.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: PARTICIPANT_LEFT,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantLeft(id) {
    return {
        type: PARTICIPANT_LEFT,
        participant: {
            id
        }
    };
}

/**
 * Create an action for when the participant in conference is pinned.
 *
 * @param {string|null} id - Participant id or null if no one is currently
 * pinned.
 * @returns {{
 *      type: PARTICIPANT_PINNED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantPinned(id) {
    return {
        type: PARTICIPANT_PINNED,
        participant: {
            id
        }
    };
}

/**
 * Action to handle case when participant's role changes.
 *
 * @param {string} id - Participant id.
 * @param {PARTICIPANT_ROLE} role - Participant's new role.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          role: PARTICIPANT_ROLE
 *      }
 * }}
 */
export function participantRoleChanged(id, role) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            role
        }
    };
}

/**
 * Create an action for when the participant's video started to play.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          videoStarted: boolean
 *      }
 * }}
 */
export function participantVideoStarted(id) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            videoStarted: true
        }
    };
}

/**
 * Create an action for when participant video type changes.
 *
 * @param {string} id - Participant id.
 * @param {string} videoType - Video type ('desktop' or 'camera').
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          videoType: string
 *      }
 * }}
 */
export function participantVideoTypeChanged(id, videoType) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            videoType
        }
    };
}

/**
 * Action to create a remote participant.
 *
 * @param {string} id - Participant id.
 * @param {Object} [participant={}] - Additional information about participant.
 * @param {string} [participant.avatar=''] - Participant's avatar.
 * @param {string} [participant.displayName='Fellow Jitster'] - Participant's
 * display name.
 * @param {string} [participant.role='none'] - Participant's role.
 * @returns {{
 *      type: PARTICIPANT_JOINED,
 *      participant: {
 *          id: string,
 *          avatar: string,
 *          name: string,
 *          role: PARTICIPANT_ROLE
 *      }
 * }}
 */
export function remoteParticipantJoined(id, participant = {}) {
    return {
        type: PARTICIPANT_JOINED,
        participant: {
            id,
            avatar: undefined, // TODO: get avatar
            // TODO: get default value from interface config
            name: participant.displayName || 'Fellow Jitster',
            role: participant.role
        }
    };
}
