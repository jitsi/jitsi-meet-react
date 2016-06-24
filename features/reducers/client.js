import {
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CONFERENCE_JOINED
} from '../constants';


const initial = {
    room: '',
    connection: null,
    conference: null
};


/**
 * Listen for actions that contain the connection or conference objects,
 * so that they can be stored for use by other action creators.
 */
export default function (state = initial, action) {
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
}
