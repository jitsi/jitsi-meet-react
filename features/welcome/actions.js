import JitsiMeetJS from '../base/lib-jitsi-meet';

import {
    addTracksToConference,
    createLocalTracks,
    trackAdded
} from '../base/tracks';

import {
    dominantSpeakerChanged,
    localParticipantJoined,
    participantLeft,
    participantRoleChanged,
    remoteParticipantJoined
} from '../base/participants';

import {
    JITSI_CLIENT_CONNECTED,
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CLIENT_ERROR,
    JITSI_CONFERENCE_JOINED,
    RTC_ERROR
} from './actionTypes';

require('./reducer');

const JitsiConnectionEvents = JitsiMeetJS.events.connection;
const JitsiConferenceEvents = JitsiMeetJS.events.conference;

/**
 * Create an action for when the signaling connection has been established.
 */
export function conferenceInitialized(conference) {
    return dispatch => {
        conference.on(JitsiConferenceEvents.CONFERENCE_JOINED,
            () => dispatch(conferenceJoined(conference)));

        conference.on(JitsiConferenceEvents.TRACK_ADDED,
            track => {
                if (!track.isLocal()) {
                    dispatch(trackAdded(track));
                }
            });

        conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
            id => dispatch(dominantSpeakerChanged(id)));

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
 */
export function connectionDisconnected(message) {
    return {
        type: JITSI_CLIENT_DISCONNECTED,
        message
    };
}

/**
 * Create an action for when the signaling connection could not be created.
 */
export function connectionError(error) {
    return {
        type: JITSI_CLIENT_ERROR,
        error
    };
}

/**
 * Create an action for when the signaling connection has been established.
 */
export function connectionEstablished(id) {
    return {
        type: JITSI_CLIENT_CONNECTED,
        id
    };
}

/**
 * Configure a newly created connection, binding its events to actions.
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
 */
export function rtcError(error) {
    return {
        type: RTC_ERROR,
        error
    };
}
