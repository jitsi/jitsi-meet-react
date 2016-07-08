import JitsiMeetJS from '../lib-jitsi-meet';

import { conferenceInitialized } from '../conference';

import { localParticipantJoined } from '../participants';

import { createLocalTracks } from '../tracks';

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
 * @param {string} message - Error message.
 * @returns {{type: CONNECTION_DISCONNECTED, message: string}}
 */
export function connectionDisconnected(message) {
    return {
        type: CONNECTION_DISCONNECTED,
        message
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
 * Create an action for when the signaling connection has been established.
 *
 * @param {string} id - The ID of the local endpoint/participant/peer (within
 *      the context of the established connection).
 * @returns {{type: CONNECTION_ESTABLISHED, id: string}}
 */
export function connectionEstablished(id) {
    return {
        type: CONNECTION_ESTABLISHED,
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
            JitsiConnectionEvents.CONNECTION_DISCONNECTED,
            msg => dispatch(connectionDisconnected(msg)));

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
