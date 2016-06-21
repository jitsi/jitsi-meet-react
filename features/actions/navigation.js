import {
    APP_NAVIGATE
} from '../constants';


export function navigate(opts) {
    return {
        type: APP_NAVIGATE,
        screen: opts.screen,
        room: opts.room,
        navigator: opts.navigator
    };
}

