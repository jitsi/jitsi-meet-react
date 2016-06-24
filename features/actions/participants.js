import {
    DOMINANT_SPEAKER_CHANGED,
    MODERATOR_CHANGED,
    PEER_JOINED,
    PEER_LEFT
} from '../constants';


/**
 * Create an action for when a new participant has joined the conference.
 */
export function userJoined(id, user) {
    return {
        type: PEER_JOINED,
        participant: {
            id: id,
            // TODO: get this from interface config
            name: user._displayName || 'Fellow Jitster',
            gravatar: '',
            moderator: user._role === 'moderator'
        }
    };
}

/**
 * Create an action for when a participant has left the conference.
 */
export function userLeft(id) {
    return {
        type: PEER_LEFT,
        participant: {
            id: id
        }
    };
}

/**
 * Create an action for when the dominant speaker in the conference
 * has changed.
 */
export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id: id
        }
    };
}

/**
 * Create an action for when the room role of a participant has changed.
 * 
 * (E.g, the user became the moderator).
 */
export function userRoleChanged(id, role) {
    return {
        type: MODERATOR_CHANGED,
        participant: {
            id: id,
            moderator: role === 'moderator'
        }
    };
}
