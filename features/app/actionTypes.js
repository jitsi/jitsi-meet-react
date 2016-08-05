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
 * The type of the actions which signals that a specific App will start.
 *
 * {
 *     type: APP_START,
 *     app: App
 * }
 */
export const APP_START = 'APP_START';

/**
 * The type of the actions which signals that a specific App will stop.
 *
 * {
 *     type: APP_STOP,
 *     app: App
 * }
 */
export const APP_STOP = 'APP_STOP';
