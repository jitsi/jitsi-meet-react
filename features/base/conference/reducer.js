import { ReducerRegistry } from '../redux';

import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    SET_ROOM
} from './actionTypes';
import { isRoomValid } from './functions';

const INITIAL_STATE = {
    jitsiConference: null,

    /**
     * The name of the room of the conference (to be) joined (i.e.
     * {@link #jitsiConference}).
     *
     * @type {(string|undefined)}
     */
    room: undefined
};

/**
 * Listen for actions that contain the conference object, so that it can be
 * stored for use by other action creators.
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
            if (state.jitsiConference === action.conference.jitsiConference) {
                return {
                    ...state,
                    jitsiConference: null
                };
            }
            break;

        case SET_ROOM: {
            let room = action.room;

            // Technically, there're multiple values which don't represent
            // valid room names. Practically, each of them is as bad as the rest
            // of them because we can't use any of them to join a conference.
            if (!isRoomValid(room)) {
                room = INITIAL_STATE.room;
            }
            if (state.room !== room) {
                return {
                    ...state,
                    room
                };
            }
            break;
        }
        }

        return state;
    });
