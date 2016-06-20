import {
    LOCAL_TRACKS_CHANGED
} from '../constants';


/**
 * Listen for actions that modify the set of local media tracks.
 */
export default function (state = [], action) {
    switch (action.type) {
    case LOCAL_TRACKS_CHANGED:
        return action.tracks;
    default:
        return state;
    }
}
