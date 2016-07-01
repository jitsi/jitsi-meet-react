import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ADDED,
    PARTICIPANT_FOCUSED,
    PARTICIPANT_PINNED,
    PARTICIPANT_REMOVED,
    PARTICIPANT_ROLE_CHANGED,
    PARTICIPANT_SELECTED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import './reducer';

/**
 * Create an action for when dominant speaker changes.
 * @param {string} id - user id
 * @returns {Object}
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
 * Action to create a local user.
 * @param {string} id - user id
 * @param {Object} [user={}]
 * @param {string} [user.displayName='me']
 * @param {string} [user.avatar='']
 * @param {string} [user.role='none']
 * @returns {Function}
 */
export function localParticipantJoined(id, user = {}) {
    return (dispatch, getState) => {
        // Local media tracks might be already created by this moment, so
        // we try to take videoType from current video track.
        let tracks = getState()['features/base/tracks'];
        let localVideoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());

        return dispatch({
            type: PARTICIPANT_ADDED,
            participant: {
                id,
                name: user.displayName || 'me',
                avatar: user.avatar || '',
                role: user.role || 'none',
                local: true,
                videoType: localVideoTrack
                    ? localVideoTrack.videoType
                    : undefined
            }
        });
    };
}

/**
 * Create an action for when the user in conference is focused.
 * @param {string|null} id - user id
 * @returns {{
 *      type: PARTICIPANT_FOCUSED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantFocused(id) {
    return {
        type: PARTICIPANT_FOCUSED,
        participant: {
            id
        }
    };
}

/**
 * Action to handle case when participant lefts.
 * @param {string} id - user id
 * @returns {{
 *      type: PARTICIPANT_REMOVED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantLeft(id) {
    return {
        type: PARTICIPANT_REMOVED,
        participant: {
            id
        }
    };
}

/**
 * Create an action for when the user in conference is pinned.
 * @param {string|null} id - user id
 * @returns {Function}
 */
export function participantPinned(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/welcome'].conference;
        let participants = getState()['features/base/participants'];
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
 * Action to handle case when participant's role changes.
 * @param {string} id - user id
 * @param {string} role - new user role
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          role: string
 *      }
 * }}
 */
export function participantRoleChanged(id, role) {
    return {
        type: PARTICIPANT_ROLE_CHANGED,
        participant: {
            id,
            role
        }
    };
}

/**
 * Create an action for when the user in conference is selected.
 * @param {string|null} id - user id
 * @returns {Function}
 */
export function participantSelected(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/welcome'].conference;

        conference && conference.selectParticipant(id);

        return dispatch({
            type: PARTICIPANT_SELECTED,
            participant: {
                id
            }
        });
    };
}

/**
 * Create an action for when the user's video started to play.
 * @param {string} id - user id
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
 * @param {string} id - user id
 * @param {string} videoType - video type
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
 * Action to create a remote user.
 * @param {string} id - user id
 * @param {Object} [user={}]
 * @param {string} [user.displayName='Fellow Jitster']
 * @param {string} [user.avatar='']
 * @param {string} [user.role='none']
 * @returns {{
 *      type: PARTICIPANT_ADDED,
 *      participant: {
 *          id: string,
 *          name: string,
 *          avatar: string,
 *          role: string
 *      }
 *  }}
 */
export function remoteParticipantJoined(id, user = {}) {
    return {
        type: PARTICIPANT_ADDED,
        participant: {
            id,
            // TODO: get default value from interface config
            name: user.displayName || 'Fellow Jitster',
            // TODO: get avatar
            avatar: user.avatar || '',
            role: user.role || 'none'
        }
    };
}
