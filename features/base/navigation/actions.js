import { APP_NAVIGATE } from './actionTypes';

// TODO: change screen param to enum when navigation is extracted into separate
// feature
/**
 * Trigger an in-app navigation to a different screen.
 * Using this action allows for navigation to be abstracted between the mobile
 * and web versions.
 * @param {Object} opts
 * @param {Navigator} opts.navigator
 * @param {string} opts.room
 * @param {string} opts.screen
 * @returns {{
 *      type: APP_NAVIGATE,
 *      navigator: Navigator,
 *      room: string,
 *      screen: string
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
