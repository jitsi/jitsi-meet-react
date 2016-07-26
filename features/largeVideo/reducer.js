import { ReducerRegistry } from '../base/redux';

import { LARGE_VIDEO_PARTICIPANT_CHANGED } from './actionTypes';

const INITIAL_STATE = {
    participantId: undefined
};

ReducerRegistry.register('features/largeVideo',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case LARGE_VIDEO_PARTICIPANT_CHANGED:
            return {
                ...state,
                participantId: action.participantId
            };

        default:
            return state;
        }
    });
