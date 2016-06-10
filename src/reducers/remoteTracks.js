import {
    REMOTE_TRACK_ADDED,
    REMOTE_TRACK_REMOVED
} from '../constants';


/**
 * Listen for actions that add or remove remote tracks.
 */
export default function (state = [], action) {
    switch (action.type) {
        case REMOTE_TRACK_ADDED:
            return [...state, action.track];
        case REMOTE_TRACK_REMOVED:
            return state.filter(track => track !== action.track);
        default:
            return state;
    }
}
