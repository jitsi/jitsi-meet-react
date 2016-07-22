import { ReducerRegistry } from '../base/redux';

import { ROOM_NAME_SET } from './actionTypes';

const INITIAL_STATE = {
    roomName: ''
};

/**
 * Listen for actions that related to welcome page, e.g. when room name is
 * changed.
 */
ReducerRegistry.register(
    'features/welcome',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case ROOM_NAME_SET:
            return {
                ...state,
                roomName: action.welcome.roomName
            };

        default:
            return state;
        }
    });
