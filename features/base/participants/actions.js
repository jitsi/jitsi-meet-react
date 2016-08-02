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
        // Local media tracks might be already created by this moment, so
        // we try to take videoType from current video track.
        let tracks = getState()['features/base/tracks'];
        let localVideoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());
        let participantId = participant.id || LOCAL_PARTICIPANT_DEFAULT_ID;

        return dispatch({
            type: PARTICIPANT_JOINED,
            participant: {
                id: participantId,
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
        let localParticipant = getState()['features/base/participants']
            .find(p => p.local);

        if (localParticipant) {
            return dispatch(participantLeft(localParticipant.id));
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
 * Create an action for when the participant in conference is pinned.
 *
 * @param {string|null} id - Participant id or null if no one is currently
 *     pinned.
 * @returns {Function}
 */
export function pinParticipant(id) {
    return (dispatch, getState) => {
        let state = getState();
        let conference = state['features/base/conference'].jitsiConference;
        let participants = state['features/base/participants'];
        let participant = participants.find(p => p.id === id);
        let localParticipant = participants.find(p => p.local);

        // This condition prevents signaling to pin local participant. Here is
        // the logic: if we have ID, then we check if participant by that ID is
        // local. If we don't have ID and thus no participant by ID, we check
        // for local participant. If it's currently pinned, then this action
        // will unpin him and that's why we won't signal here too.
        if ((participant && !participant.local) ||
            (!participant && (!localParticipant || !localParticipant.pinned))) {
            conference.pinParticipant(id);
        }

        return dispatch({
            type: PARTICIPANT_PINNED,
            participant: {
                id
            }
        });
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