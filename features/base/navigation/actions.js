import {
    APP_NAVIGATE
} from './actionTypes';


/**
 * Trigger an in-app navigation to a different screen.
 *
 * Using this action allows for navigation to abstracted
 * between the mobile and web versions.
 */
export function navigate(opts) {
    return {
        type: APP_NAVIGATE,
        screen: opts.screen,
        room: opts.room,
        navigator: opts.navigator
    };
}

