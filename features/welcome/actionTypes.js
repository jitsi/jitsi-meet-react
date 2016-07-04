/**
 * Action type to signal that have successfully created a connection.
 *
 * @type {string}
 */
export const JITSI_CLIENT_CONNECTED = 'JITSI_CLIENT_CONNECTED';

/**
 * Action type to signal that have successfully created client.
 *
 * @type {string}
 */
export const JITSI_CLIENT_CREATED = 'JITSI_CLIENT_CREATED';

/**
 * Action type to signal that connection has disconnected.
 *
 * @type {string}
 */
export const JITSI_CLIENT_DISCONNECTED = 'JITSI_CLIENT_DISCONNECTED';

/**
 * Action type to signal a client error.
 *
 * @type {string}
 */
export const JITSI_CLIENT_ERROR = 'JITSI_CLIENT_ERROR';

/**
 * Action type to signal that we are joining the conference.
 *
 * @type {string}
 */
export const JITSI_CONFERENCE_JOINED = 'JITSI_CONFERENCE_JOINED';

/**
 * Action type to signal that we have left the conference.
 *
 * @type {string}
 */
export const JITSI_CONFERENCE_LEFT = 'JITSI_CONFERENCE_LEFT';

/**
 * Action type to signal generic WebRTC error.
 * 
 * @type {string}
 */
export const RTC_ERROR = 'RTC_ERROR';