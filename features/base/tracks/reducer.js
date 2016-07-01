import { ReducerRegistry } from '../redux';

import {
    TRACK_ADDED,
    TRACK_MUTE_CHANGED,
    TRACK_REMOVED
} from './actionTypes';

import {
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE
} from '../../toolbar/actionTypes';


/**
 * Listen for actions that add or remove remote tracks.
 */
ReducerRegistry.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
    case TOGGLE_AUDIO_MUTED_STATE:
        return [...state];
    case TOGGLE_VIDEO_MUTED_STATE:
        return [...state];
    case TRACK_ADDED:
        return [...state, action.track];
    case TRACK_MUTE_CHANGED:
        return [...state];
    case TRACK_REMOVED:
        return state.filter(track => track !== action.track);
    default:
        return state;
    }
});
