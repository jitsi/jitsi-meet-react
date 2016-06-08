import { 
    LOCAL_TRACKS_ADDED
} from '../actions';


export default function (state = [], action) {
    switch (action.type) {
        case LOCAL_TRACKS_ADDED:
            return action.tracks;
        default:
            return state;
    }
}

