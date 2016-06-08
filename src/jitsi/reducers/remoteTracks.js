import { 
    REMOTE_TRACK_ADDED
} from '../actions';


export default function (state = [], action) {
    switch (action.type) {
        case REMOTE_TRACK_ADDED:
            return [...state, action.track];
        default:
            return state;
    }
}

