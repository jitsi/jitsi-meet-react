import JitsiMeetJS from '../base/lib-jitsi-meet';
import {
    dominantSpeakerChanged,
    localParticipantJoined,
    participantLeft,
    participantRoleChanged,
    participantVideoTypeChanged,
    remoteParticipantJoined
} from '../base/participants';
import {
    addTracksToConference,
    createLocalTracks,
    trackAdded,
    trackMuteChanged
} from '../base/tracks';

import {
    JITSI_CLIENT_CONNECTED,
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CLIENT_ERROR,
    JITSI_CONFERENCE_JOINED,
    RTC_ERROR
} from './actionTypes';
import './reducer';

const JitsiConnectionEvents = JitsiMeetJS.events.connection;
const JitsiConferenceEvents = JitsiMeetJS.events.conference;
const JitsiTrackEvents = JitsiMeetJS.events.track;

/**
 * Create an action for when the signaling connection has been established.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @returns {Function}
 */
export function conferenceInitialized(conference) {
    return dispatch => {
        conference.on(JitsiConferenceEvents.CONFERENCE_JOINED,
            () => dispatch(conferenceJoined(conference)));

        conference.on(JitsiConferenceEvents.TRACK_ADDED,
            track => {
                if (!track || track.isLocal()) {
                    return;
                }

                dispatch(trackAdded(track));

                track.on(JitsiTrackEvents.TRACK_VIDEOTYPE_CHANGED, type => {
                    dispatch(participantVideoTypeChanged(
                        track.getParticipantId(), type));
                });
            });

        conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
            id => dispatch(dominantSpeakerChanged(id)));

        conference.on(JitsiConferenceEvents.TRACK_MUTE_CHANGED,
            track => dispatch(trackMuteChanged(track)));

        conference.on(JitsiConferenceEvents.USER_ROLE_CHANGED,
            (id, role) => dispatch(participantRoleChanged(id, role)));

        conference.on(JitsiConferenceEvents.USER_JOINED,
            (id, user) => dispatch(remoteParticipantJoined(id, {
                role: user.getRole(),
                displayName: user.getDisplayName()
            })));

        conference.on(JitsiConferenceEvents.USER_LEFT,
            id => dispatch(participantLeft(id)));

        conference.join();
    };
}

/**
 * Attach any pre-existing local media to the conference once the
 * conference has been joined.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @returns {Function}
 */
export function conferenceJoined(conference) {
    return (dispatch, getState) => {
        let localTracks = getState()['features/base/tracks']
            .filter(t => t.isLocal());

        if (localTracks.length) {
            addTracksToConference(conference, localTracks);
        }

        dispatch({
            type: JITSI_CONFERENCE_JOINED,
            conference
        });
    };
}

/**
 * Create an action for when the signaling connection has been lost.
 *
 * @param {string} message - Error message.
 * @returns {{type: JITSI_CLIENT_DISCONNECTED, message: string}}
 */
export function connectionDisconnected(message) {
    return {
        type: JITSI_CLIENT_DISCONNECTED,
        message
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
