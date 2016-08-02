import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT
} from '../base/conference';
import { LOCAL_PARTICIPANT_DEFAULT_ID } from '../base/participants';
import { ReducerRegistry } from '../base/redux';

import { LARGE_VIDEO_PARTICIPANT_CHANGED } from './actionTypes';

const INITIAL_STATE = {
    participantId: undefined
};

ReducerRegistry.register('features/largeVideo',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        /**
         * When conference is joined, we update ID of local participant from
         * default 'local' to real ID. However in large video we might have
         * already selected 'local' as participant on stage. So in this case
         * we must update ID of participant on stage to match ID in
         * 'participants' state to avoid additional changes in state and
         * rerenders.
         */
        case CONFERENCE_JOINED:
            if (state.participantId === LOCAL_PARTICIPANT_DEFAULT_ID) {
                let id = action.conference.jitsiConference.myUserId();

                return {
                    ...state,
                    participantId: id
                };
            }

            return state;
        /**
         * Reverse operation to CONFERENCE_JOINED.
         */
        case CONFERENCE_LEFT:
            return {
                ...state,
                participantId: LOCAL_PARTICIPANT_DEFAULT_ID
            };

        case LARGE_VIDEO_PARTICIPANT_CHANGED:
            return {
                ...state,
                participantId: action.participantId
            };

        default:
            return state;
        }
    });
