import {
    PEER_JOINED,
    PEER_LEFT,
    PEER_CHANGED,
    DOMINANT_SPEAKER_CHANGED,
    MODERATOR_CHANGED
} from '../actions';


export default function (state = {}, action) {
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
        default:
            return state;
    }
}

