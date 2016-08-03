import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ID_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import './middleware';
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
 * Action to signal that ID of local participant has changed. This happens when
 * local participant joins a new conference or quits one.
 *
 * @param {string} id - New ID for local participant.
 * @returns {{
 *      type: PARTICIPANT_ID_CHANGED,
 *      newValue: string,
 *      oldValue: string
 * }}
 */
export function localParticipantIdChanged(id) {
    return (dispatch, getState) => {
        let participant = _getLocalParticipant(getState);

        if (participant) {
            return dispatch({
                type: PARTICIPANT_ID_CHANGED,
                newValue: id,
                oldValue: participant.id
            });
        }
    };
}

/**
 * Action to signal that a local participant has joined.
 *
 * @param {Participant} participant - Information about participant.
 * @returns {Function}
 */
export function localParticipantJoined(participant) {
    return (dispatch, getState) => {
        // TODO This is temporary and will be removed in
        // https://github.com/jitsi/jitsi-meet-react/pull/65.
        // Local media tracks might be created already by this moment, so we try
        // to take videoType from current video track.
        let localVideoTrack = getState()['features/base/tracks']
            .find(t => t.isLocal() && t.isVideoTrack());

        return dispatch(participantJoined({
            ...participant,
            local: true,
            videoType: localVideoTrack
                ? localVideoTrack.videoType
                : undefined
        }));
    };
}

/**
 * Action to remove a local participant.
 *
 * @returns {Function}
 */
export function localParticipantLeft() {
    return (dispatch, getState) => {
        let participant = _getLocalParticipant(getState);

        if (participant) {
            return dispatch(participantLeft(participant.id));
        }
    };
}

/**
 * Action to signal that a participant has joined.
 *
 * @param {Participant} participant - Information about participant.
 * @returns {{
 *      type: PARTICIPANT_JOINED,
 *      participant: Participant
 * }}
 */
export function participantJoined(participant) {
    return {
        type: PARTICIPANT_JOINED,
        participant
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
        let participant = state['features/base/participants']
            .find(p => p.id === id);
        let localParticipant = _getLocalParticipant(getState);

        // This condition prevents signaling to pin local participant. Here is
        // the logic: if we have ID, then we check if participant by that ID is
        // local. If we don't have ID and thus no participant by ID, we check
        // for local participant. If it's currently pinned, then this action
        // will unpin him and that's why we won't signal here too.
        if ((participant && !participant.local)
                || (!participant
                    && (!localParticipant || !localParticipant.pinned))) {
            let conference = state['features/base/conference'].jitsiConference;

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
 * Returns local participant from Redux state.
 *
 * @param {Function} getState - Redux getState() method.
 * @private
 * @returns {(Participant|undefined)}
 */
function _getLocalParticipant(getState) {
    return getState()['features/base/participants'].find(p => p.local);
}
