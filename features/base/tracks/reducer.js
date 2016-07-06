import { ReducerRegistry } from '../redux';

import {
    TRACK_ADDED,
    TRACK_MUTE_CHANGED,
    TRACK_REMOVED
} from './actionTypes';

/**
 * Listen for actions that add or remove remote tracks.
 */
ReducerRegistry.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
    case TRACK_ADDED:
        return [...state, action.track];
    case TRACK_MUTE_CHANGED:
        // XXX While the JitsiTrack is in the redux state, its mute state is
        // not. Consequently, the action TRACK_MUTE_CHANGED gets reduced to a
        // mere simulation of a state change.
        return [...state];
    case TRACK_REMOVED:
        return state.filter(track => track !== action.track);
    default:
        return state;
    }
});
