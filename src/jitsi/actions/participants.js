import {
    DOMINANT_SPEAKER_CHANGED,
    MODERATOR_CHANGED,
    PEER_JOINED,
    PEER_LEFT
} from './';

export function userJoined(id, user) {
    return {
        type: PEER_JOINED,
        participant: {
            id: id,
            // TODO: get this from interface config
            name: user._displayName || 'Fellow Jitster',
            gravatar: '',
            speaking: false,
            moderator: user._role === 'moderator'
        }
    }
}

export function userLeft(id, user) {
    return {
        type: PEER_LEFT,
        participant: {
            id: id
        }
    }
}

export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id: id
        }
    };
}

export function userRoleChanged(id, role) {
    return {
        type: MODERATOR_CHANGED,
        participant: {
            id: id,
            moderator: role === 'moderator'
        }
    }
}