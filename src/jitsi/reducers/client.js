import {
    JITSI_CLIENT_CREATED,
    JITSI_CONFERENCE_JOINED
} from '../actions';


const initial = {
    room: '',
    connection: null,
    conference: null
};


export default function (state = initial, action) {
    switch (action.type) {
        case JITSI_CLIENT_CREATED:
            return {
                ...state,
                connection: action.client,
                room: action.room
            };
        case JITSI_CONFERENCE_JOINED:
            return {
                ...state,
                conference: action.conference
            };
        default:
            return state;
    }
}

