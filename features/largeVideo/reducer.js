import { ReducerRegistry } from '../base/redux';

import { ON_STAGE_PARTICIPANT_CHANGED } from './actionTypes';

const INITIAL_STATE = {
    onStageParticipantId: undefined
};

ReducerRegistry.register('features/largeVideo',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case ON_STAGE_PARTICIPANT_CHANGED:
            return {
                ...state,
                onStageParticipantId: action.largeVideo.onStageParticipantId
            };

        default:
            return state;
        }
    });