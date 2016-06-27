import Reducers from '../../../ReducerRegistry';

import {
    TRACK_ADDED,
    TRACK_REMOVED
} from './actionTypes';

/**
 * Listen for actions that add or remove remote tracks.
 */
Reducers.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
        case TRACK_ADDED:
            return [...state, action.track];
        case TRACK_REMOVED:
            return state.filter(track => track !== action.track);
        default:
            return state;
    }
});