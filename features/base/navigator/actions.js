import { APP_NAVIGATE } from './actionTypes';
import './middleware';

/**
 * Trigger an in-app navigation to a different route. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {Object} opts - Navigation options.
 * @param {Navigator} opts.navigator - Navigator instance.
 * @param {string} opts.room - Conference room name.
 * @param {string} opts.component - The React Component (class) to switch to.
 * @returns {{
 *      type: APP_NAVIGATE,
 *      component: Object,
 *      navigator: Navigator,
 *      room: string
 * }}
 */
export function navigate(opts) {
    return {
        type: APP_NAVIGATE,
        component: opts.component,
        navigator: opts.navigator,
        room: opts.room
    };
}