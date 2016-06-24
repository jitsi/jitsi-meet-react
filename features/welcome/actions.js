require('../polyfills');

import JitsiMeetJS from 'lib-jitsi-meet';

import { createLocalTracks } from '../base/tracks';

import {
    DOMINANT_SPEAKER_CHANGED,
    JITSI_CLIENT_CONNECTED,
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CLIENT_ERROR,
    JITSI_CONFERENCE_JOINED,
    MODERATOR_CHANGED,
    PEER_JOINED,
    PEER_LEFT,
    RTC_ERROR
} from './actionTypes';

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
                    dispatch(remoteTrackAdded(track))
                }
            });

        conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
            (id) => dispatch(dominantSpeakerChanged(id)));

        conference.on(JitsiConferenceEvents.USER_ROLE_CHANGED,
            (id, role) => dispatch(userRoleChanged(id, role)));

        conference.on(JitsiConferenceEvents.USER_JOINED,
            (id, user) => dispatch(userJoined(id, user)));

        conference.on(JitsiConferenceEvents.USER_LEFT,
            (id, user) => dispatch(userLeft(id, user)));

        conference.join();
    }
}

/**
 * Attach any pre-existing local media to the conference once the
 * conference has been joined.
 */
export function conferenceJoined(conference) {
    return (dispatch, getState) => {
        var localTracks = getState().localTracks;
        if (localTracks) {
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
 * Create an action for when the dominant speaker in the conference
 * has changed.
 */
export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id: id
        }
    };
}

/**
 * Initialize the JitsiMeetJS library, start local media, and then join
 * the named conference.
 */
export function init(config, room) {
    return (dispatch, getState) => {
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
 * Create an action for when a new track has been signaled to be added
 * to the conference.
 */
export function remoteTrackAdded(track) {
    return {
        type: REMOTE_TRACK_ADDED,
        track
    };
}

/**
 * Create an action for when the JitsiMeetJS library could not be initialized.
 */
export function rtcError(error) {
    return {
        type: RTC_ERROR,
        error
    }
}

/**
 * Create an action for when a new participant has joined the conference.
 */
export function userJoined(id, user) {
    return {
        type: PEER_JOINED,
        participant: {
            id: id,
            // TODO: get this from interface config
            name: user._displayName || 'Fellow Jitster',
            gravatar: '',
            moderator: user._role === 'moderator'
        }
    };
}

/**
 * Create an action for when a participant has left the conference.
 */
export function userLeft(id, user) {
    return {
        type: PEER_LEFT,
        participant: {
            id: id
        }
    };
}

/**
 * Create an action for when the room role of a participant has changed.
 *
 * (E.g, the user became the moderator).
 */
export function userRoleChanged(id, role) {
    return {
        type: MODERATOR_CHANGED,
        participant: {
            id: id,
            moderator: role === 'moderator'
        }
    };
}
