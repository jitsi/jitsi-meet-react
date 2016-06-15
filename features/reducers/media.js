import {
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE,
    CHANGE_CAMERA_FACING_MODE
} from '../constants';

const initial = {
    audioMuted: false,
    videoMuted: false,
    cameraId: undefined,
    micId: undefined,
    cameraFacingMode: 'user'
};

/**
 * Listen for actions that toggle the desired state of local media capture,
 * i.e. disable or enable audio or video capture.
 */
export default function (state = initial, action) {
    switch (action.type) {
        case TOGGLE_AUDIO_MUTED_STATE:
            return {
                ...state,
                audioMuted: !state.audioMuted
            };
        case TOGGLE_VIDEO_MUTED_STATE:
            return {
                ...state,
                videoMuted: !state.videoMuted
            };
        case CHANGE_CAMERA_FACING_MODE:
            return {
                ...state,
                cameraFacingMode: action.media.cameraFacingMode
            };
        default:
            return state;
    }
}
