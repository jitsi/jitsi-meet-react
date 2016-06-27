import Reducers from '../../ReducerRegistry';

import {
    DOMINANT_SPEAKER_CHANGED,
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CONFERENCE_JOINED,
    MODERATOR_CHANGED,
    PEER_CHANGED,
    PEER_JOINED,
    PEER_LEFT
} from './actionTypes';

const INITIAL_STATE = {
    room: '',
    connection: null,
    conference: null
};

/**
 * Listen for actions that contain the connection or conference objects,
 * so that they can be stored for use by other action creators.
 */
Reducers.register('features/welcome', (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case JITSI_CLIENT_CREATED:
        return {
            ...state,
            connection: action.connection,
            room: action.room
        };
    case JITSI_CLIENT_DISCONNECTED:
        return {};
    case JITSI_CONFERENCE_JOINED:
        return {
            ...state,
            conference: action.conference
        };
    default:
        return state;
    }
});


/**
 * Listen for actions which add, remove, or update the set of participants
 * in the conference.
 */
Reducers.register('features/welcome/participants', (state = {}, action) => {
    let participants = {};

    switch (action.type) {
    case PEER_JOINED:
        return Object.assign({}, state, {
            [action.participant.id]: action.participant
        });
    case PEER_LEFT:
        participants = Object.assign({}, state);

        delete participants[action.participant.id];

        return participants;
    case DOMINANT_SPEAKER_CHANGED:
        for (let key in state) {
            if (state.hasOwnProperty(key)) {
                participants[key] = Object.assign({}, state[key], {
                    speaking: false
                });
            }
        }

        if (participants[action.participant.id]) {
            participants[action.participant.id].speaking = true;
        }

        return participants;
    case MODERATOR_CHANGED:
        for (let key in state) {
            if (state.hasOwnProperty(key)) {
                if (key === action.participant.id) {
                    participants[key] = Object.assign(
                        {}, state[key], action.participant);
                } else {
                    participants[key] = state[key];
                }
            }
        }

        return participants;
    case PEER_CHANGED:
        for (let key in state) {
            if (state.hasOwnProperty(key)) {
                participants[key] = Object.assign(
                    {}, state[key], action.participant);
            }
        }

        return participants;
    default:
        return state;
    }
});
