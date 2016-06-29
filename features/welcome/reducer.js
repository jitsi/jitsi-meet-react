import { ReducerRegistry } from '../base/redux';

import {
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CONFERENCE_JOINED
} from './actionTypes';

const INITIAL_STATE = {
    conference: null,
    connection: null,
    room: ''
};

/**
 * Listen for actions that contain the connection or conference objects,
 * so that they can be stored for use by other action creators.
 */
ReducerRegistry.register('features/welcome',
    (state = INITIAL_STATE, action) => {
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
