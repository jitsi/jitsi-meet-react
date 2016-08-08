/**
 * The type of the action which triggers an in-app navigation to a different
 * route.
 *
 * {
 *     type: APP_NAVIGATE,
 *     route: Route
 * }
 */
export const APP_NAVIGATE = 'APP_NAVIGATE';

/**
 * The type of the actions which signals that a specific App will mount (in the
 * terms of React).
 *
 * {
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }
 */
export const APP_WILL_MOUNT = 'APP_WILL_MOUNT';

/**
 * The type of the actions which signals that a specific App will unmount (in
 * the terms of React).
 *
 * {
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }
 */
export const APP_WILL_UNMOUNT = 'APP_WILL_UNMOUNT';
