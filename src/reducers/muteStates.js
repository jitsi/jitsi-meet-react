import {
    TOGGLE_AUDIO,
    TOGGLE_VIDEO
} from '../constants';


const initial = {
    audioMuted: false,
    videoMuted: false
};

/**
 * Listen for actions that toggle the desired state of local media capture,
 * i.e. disable or enable audio or video capture.
 */
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
