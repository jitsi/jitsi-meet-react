import {
    TOGGLE_AUDIO,
    TOGGLE_VIDEO
} from '../actions';


const initial = {
    audioMuted: false,
    videoMuted: false
};


export default function (state = initial, action) {
    switch (action.type) {
        case TOGGLE_AUDIO:
            return {
                ...state,
                audioMuted: !state.audioMuted
            };
        case TOGGLE_VIDEO:
            return {
                ...state,
                videoMuted: !state.videoMuted
            };
        default:
            return state;
    }
}

