import {
    PEER_JOINED,
    PEER_LEFT,
    PEER_CHANGED
} from '../actions';


export default function (state = {}, action) {
    switch (action.type) {
        case PEER_JOINED:
            return Object.assign({}, state, {
                [action.participant.id]: action.participant
            });
        case PEER_LEFT:
            return Object.assign({}, state, {
                [action.participant.id]: undefined
            });
        case PEER_CHANGED:
        default:
            return state;
    }
}

