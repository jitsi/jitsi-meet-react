import { CONNECTION_DISCONNECTED } from '../base/connection';
import { ReducerRegistry } from '../base/redux';

import {
    CHANGE_CAMERA_FACING_MODE,
    TOGGLE_AUDIO_MUTED_STATE,
    TOGGLE_VIDEO_MUTED_STATE
} from './actionTypes';

const INITIAL_STATE = {
    audioMuted: false,
    cameraFacingMode: 'user',
    cameraId: undefined,
    micId: undefined,
    videoMuted: false
};

/**
 * Listen for actions that toggle the desired state of local media capture,
 * i.e. disable or enable audio or video capture.
 */
ReducerRegistry.register(
    'features/toolbar',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case CHANGE_CAMERA_FACING_MODE:
            return {
                ...state,
                cameraFacingMode: action.cameraFacingMode
            };

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

        /**
         * Reset toolbar to initial state when connection is disconnected.
         */
        case CONNECTION_DISCONNECTED:
            return INITIAL_STATE;

        default:
            return state;
        }
    });
