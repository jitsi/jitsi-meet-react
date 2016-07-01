import { APP_NAVIGATE } from './actionTypes';

// TODO: change screen param to enum when navigation is extracted into separate
// feature
/**
 * Trigger an in-app navigation to a different screen.
 * Using this action allows for navigation to be abstracted between the mobile
 * and web versions.
 *
 * @param {Object} opts - Navigation options.
 * @param {Navigator} opts.navigator - Navigator instance.
 * @param {string} opts.room - Conference room name.
 * @param {string} opts.screen - Name of state/screen to switch to.
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
