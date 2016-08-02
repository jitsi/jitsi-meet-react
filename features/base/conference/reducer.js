import { ReducerRegistry } from '../redux';

import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    ROOM_SET
} from './actionTypes';

const INITIAL_STATE = {
    jitsiConference: null,
    room: ''
};

/**
 * Listen for actions that contain the conference object, so that
 * it can be stored for use by other action creators.
 */
ReducerRegistry.register('features/base/conference',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case CONFERENCE_JOINED:
            return {
                ...state,
                jitsiConference: action.conference.jitsiConference
            };

        case CONFERENCE_LEFT:
            return {
                ...state,
                jitsiConference: state.jitsiConference
                    === action.conference.jitsiConference
                        ? null
                        : state.jitsiConference
            };

        case ROOM_SET:
            return {
                ...state,
                room: action.conference.room
            };

        default:
            return state;
        }
    });
