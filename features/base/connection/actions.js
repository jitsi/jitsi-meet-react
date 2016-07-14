import { conferenceInitialized } from '../conference';
import JitsiMeetJS from '../lib-jitsi-meet';
import { localParticipantJoined } from '../participants';
import {
    createLocalTracks,
    destroyLocalTracks
} from '../tracks';

import {
    CONNECTION_CREATED,
    CONNECTION_DISCONNECTED,
    CONNECTION_ESTABLISHED,
    CONNECTION_FAILED,
    RTC_ERROR
} from './actionTypes';
import './reducer';

const JitsiConnectionEvents = JitsiMeetJS.events.connection;

/**
 * Create an action for when the signaling connection has been lost.
 *
 * @param {JitsiConnection} connection - The JitsiConnection which was
 * disconnected.
 * @param {string} message - Error message.
 * @returns {{
 *     type: CONNECTION_DISCONNECTED,
 *     connection: JitsiConnection,
 *     message: string
 * }}
 */
export function connectionDisconnected(connection, message) {
    return {
        type: CONNECTION_DISCONNECTED,
        connection,
        message
    };
}

/**
 * Create an action for when the signaling connection has been established.
 *
 * @param {string} id - The ID of the local endpoint/participant/peer (within
 * the context of the established connection).
 * @returns {{type: CONNECTION_ESTABLISHED, id: string}}
 */
export function connectionEstablished(id) {
    return {
        type: CONNECTION_ESTABLISHED,
        id
    };
}

/**
 * Create an action for when the signaling connection could not be created.
 *
 * @param {string} error - Error message.
 * @returns {{type: CONNECTION_FAILED, error: string}}
 */
export function connectionFailed(error) {
    return {
        type: CONNECTION_FAILED,
        error
    };
}

/**
 * Configure a newly created connection, binding its events to actions.
 *
 * @param {JitsiConnection} connection - Connection instance.
 * @param {string} room - Conference room name.
 * @returns {Function}
 */
export function connectionInitialized(connection, room) {
    return dispatch => {
        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_DISCONNECTED,
            msg => dispatch(connectionDisconnected(connection, msg)));

        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_ESTABLISHED,
            id => {
                let conference = connection.initJitsiConference(room, {
                    openSctp: true
                });
                dispatch(localParticipantJoined(conference.myUserId()));
                dispatch(connectionEstablished(id));
                dispatch(conferenceInitialized(conference));
            });

        connection.addEventListener(
            JitsiConnectionEvents.CONNECTION_FAILED,
            err => dispatch(connectionFailed(err)));

        connection.connect();

        dispatch({
            type: CONNECTION_CREATED,
            room,
            connection
        });
    };
}

/**
 * Leaves the conference, closes the connection and destroys local tracks.
 *
 * @returns {Function}
 */
export function destroy() {
    return (dispatch, getState) => {
        const state = getState();
        const conference = state['features/base/conference'];
        const connection = state['features/base/connection'];

        let promise = Promise.resolve();

        if (conference) {
            promise = conference.leave();
        }

        if (connection) {
            promise = promise
                .then(() => connection.disconnect());
        }

        // XXX Local tracks might exist without conference and connection
        // initialized, so we need to explicitly clean them here.
        return promise
            .then(() => dispatch(destroyLocalTracks()));
    };
}

/**
 * Initialize the JitsiMeetJS library, start local media, and then join
 * the named conference.
 *
 * @param {Object} config - Configuration object.
 * @param {string} room - Conference room name.
 * @returns {Function}
 */
export function init(config, room) {
    return dispatch => {
        JitsiMeetJS.init({}).then(() => {
            dispatch(createLocalTracks());

            const connection = new JitsiMeetJS.JitsiConnection(
                config.appId,
                config.token,
                {
                    ...config.connection,
                    bosh: config.connection.bosh + (
                        room ? ('?room=' + room) : ''
                    )
                }
            );

            dispatch(connectionInitialized(connection, room));
        }).catch(error => {
            dispatch(rtcError(error));
        });
    };
}

/**
 * Create an action for when the JitsiMeetJS library could not be initialized.
 *
 * @param {Object} error - Generic Error.
 * @returns {{type: RTC_ERROR, error: Object}}
 */
export function rtcError(error) {
    return {
        type: RTC_ERROR,
        error
    };
}
