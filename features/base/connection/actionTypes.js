/**
 * Action type to signal that have successfully created connection instance.
 *
 * @type {string}
 */
export const CONNECTION_CREATED = 'CONNECTION_CREATED';

/**
 * Action type to signal that connection has disconnected.
 *
 * @type {string}
 */
export const CONNECTION_DISCONNECTED = 'CONNECTION_DISCONNECTED';

/**
 * Action type to signal that have successfully established a connection.
 *
 * @type {string}
 */
export const CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED';

/**
 * Action type to signal a connection error.
 *
 * @type {string}
 */
export const CONNECTION_FAILED = 'CONNECTION_FAILED';

/**
 * Action type to signal generic WebRTC error.
 * 
 * @type {string}
 */
export const RTC_ERROR = 'RTC_ERROR';