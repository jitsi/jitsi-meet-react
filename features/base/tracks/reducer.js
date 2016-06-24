import Reducers from '../../../ReducerRegistry';

import {
    REMOTE_TRACK_ADDED,
    REMOTE_TRACK_REMOVED,
    LOCAL_TRACKS_CHANGED
} from './actionTypes';


/**
 * Listen for actions that add or remove remote tracks.
 */
Reducers.register('features/base/tracks', (state = [], action) => {
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
