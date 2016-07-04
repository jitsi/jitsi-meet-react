import JitsiMeetJS from '../base/lib-jitsi-meet';

import {
    localParticipantJoined,
    removeLocalParticipant
} from '../base/participants';

import {
    createLocalTracks,
    removeLocalTracks
} from '../base/tracks';

import {
    conferenceInitialized
} from '../conference';

import {
    JITSI_CLIENT_CONNECTED,
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CLIENT_ERROR,
    RTC_ERROR
} from './actionTypes';

import './reducer';

const JitsiConnectionEvents = JitsiMeetJS.events.connection;

/**
 * Create an action for when the signaling connection has been lost.
 *
 * @param {string} [message] - Error message.
 * @returns {{type: JITSI_CLIENT_DISCONNECTED, message: string}}
 */
export function connectionDisconnected(message) {
    return dispatch => {
        dispatch(removeLocalParticipant());

        return dispatch(removeLocalTracks())
            .then(() => dispatch({ type: JITSI_CLIENT_DISCONNECTED, message }));
    };
}

/**
 * Create an action for when the signaling connection could not be created.
 *
 * @param {string} error - Error message.
 * @returns {{type: JITSI_CLIENT_ERROR, error: string}}
 */
export function connectionError(error) {
    return {
        type: JITSI_CLIENT_ERROR,
        error
    };
}

/**
 * Create an action for when the signaling connection has been established.
 *
 * @param {string} id - The ID of the local endpoint/participant/peer (within
 *      the context of the established connection).
 * @returns {{type: JITSI_CLIENT_CONNECTED, id: string}}
 */
export function connectionEstablished(id) {
    return {
        type: JITSI_CLIENT_CONNECTED,
        id
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
            err => dispatch(connectionError(err)));

        connection.connect();

        dispatch({
            type: JITSI_CLIENT_CREATED,
            room,
            connection
        });
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

/**
 * Disconnect from connection.
 *
 * @returns {Function}
 */
export function disconnectConnection() {
    return (dispatch, getState) => {
        const connection = getState()['features/connection'];

        if (connection) {
            connection.disconnect();

            dispatch(connectionDisconnected());
        }
    };
}