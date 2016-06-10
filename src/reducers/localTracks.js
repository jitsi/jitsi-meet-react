import {
    LOCAL_TRACKS_ADDED
} from '../constants';


/**
 * Listen for actions that modify the set of local media tracks.
 */
export default function (state = [], action) {
    switch (action.type) {
        case LOCAL_TRACKS_ADDED:
            return action.tracks;
        default:
            return state;
    }
}
