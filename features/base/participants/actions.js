import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ADDED,
    PARTICIPANT_PINNED,
    PARTICIPANT_REMOVED,
    PARTICIPANT_ROLE_CHANGED,
    PARTICIPANT_VIDEO_STARTED
} from './actionTypes';

require('./reducer');


/**
 * Action to create a local user.
 * @param {string} id - user id
 * @param {Object} user={}
 * @param {string} (user.displayName='me')
 * @param {string} (user.avatar='')
 * @param {string} (user.role='none')
 * @returns {Object}
 */
export function localParticipantJoined(id, user = {}) {
    return {
        type: PARTICIPANT_ADDED,
        participant: {
            id: id,
            name: user.displayName || 'me',
            avatar: user.avatar || '',
            role: user.role || 'none',
            local: true
        }
    };
}

/**
 * Action to create a remote user.
 * @param {string} id - user id
 * @param {Object} user={}
 * @param {string} (user.displayName='Fellow Jitster')
 * @param {string} (user.avatar='')
 * @param {string} (user.role='none')
 * @returns {Object}
 */
export function remoteParticipantJoined(id, user = {}) {
    return {
        type: PARTICIPANT_ADDED,
        participant: {
            id: id,
            // TODO: get default value from interface config
            name: user.displayName || 'Fellow Jitster',
            // TODO: get avatar
            avatar: user.avatar || '',
            role: user.role || 'none'
        }
    };
}

/**
 * Action to handle case when participant lefts.
 * @param {string} id - user id
 * @returns {Object}
 */
export function participantLeft(id) {
    return {
        type: PARTICIPANT_REMOVED,
        participant: {
            id: id
        }
    };
}

/**
 * Action to handle case when participant's role changes.
 * @param {string} id - user id
 * @param {string} role - new user role
 * @returns {Object}
 */
export function participantRoleChanged(id, role) {
    return {
        type: PARTICIPANT_ROLE_CHANGED,
        participant: {
            id: id,
            role: role
        }
    };
}
/**
 * Create an action for when the user in conference is pinned.
 * @param {string|null} id - user id
 * @returns {Object}
 */
export function participantPinned(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/welcome'].conference;
        let participant = getState()['features/base/participants']
            .find(p => p.id === id);

        if (!participant || !participant.local) {
            conference.pinParticipant(id);
        }

        return dispatch({
            type: PARTICIPANT_PINNED,
            participant: {
                id: id
            }
        });
    };
}

/**
 * Create an action for when the user's video started to play.
 * @param {string} id - user id
 * @returns {Object}
 */
export function participantVideoStarted(id) {
    return {
        type: PARTICIPANT_VIDEO_STARTED,
        participant: {
            id: id
        }
    };
}

/**
 * Create an action for when dominant speaker changes.
 * @param {string} id - user id
 * @returns {Object}
 */
export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id: id
        }
    };
}
