import { APP_NAVIGATE } from './actionTypes';

/**
 * Trigger an in-app navigation to a different screen. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {Object} opts - Navigation options.
 * @param {Navigator} opts.navigator - Navigator instance.
 * @param {string} opts.room - Conference room name.
 * @param {APP_SCREEN} opts.screen - Name of route/screen to switch to.
 * @returns {{
 *      type: APP_NAVIGATE,
 *      navigator: Navigator,
 *      room: string,
 *      screen: APP_SCREEN
 * }}
 */
export function navigate(opts) {
    return {
        type: APP_NAVIGATE,
        navigator: opts.navigator,
        room: opts.room,
        screen: opts.screen
    };
}
