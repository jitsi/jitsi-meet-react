import {
    APP_NAVIGATE,
    APP_WILL_MOUNT,
    APP_WILL_UNMOUNT
} from './actionTypes';
import './middleware';
import './reducer';

/**
 * Triggers an in-app navigation to a different route. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {Route} route - The Route to which to navigate.
 * @returns {{
 *      type: APP_NAVIGATE,
 *      route: Route
 * }}
 */
export function appNavigate(route) {
    return {
        type: APP_NAVIGATE,
        route
    };
}

/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export function appWillMount(app) {
    return {
        type: APP_WILL_MOUNT,
        app
    };
}

/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export function appWillUnmount(app) {
    return {
        type: APP_WILL_UNMOUNT,
        app
    };
}
