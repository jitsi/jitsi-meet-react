import { ReducerRegistry } from '../redux';

import {
    LOCAL_TRACKS_CHANGED,
    REMOTE_TRACK_ADDED,
    REMOTE_TRACK_REMOVED
} from './actionTypes';

/**
 * Listen for actions that add or remove remote tracks.
 */
ReducerRegistry.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
    case LOCAL_TRACKS_CHANGED:
        return [...action.tracks, ...state.filter(track => !track.isLocal())];
    case REMOTE_TRACK_ADDED:
        return [...state, action.track];
    case REMOTE_TRACK_REMOVED:
        return state.filter(track => track !== action.track);
    default:
        return state;
    }
});
