import config from '../../config';
import JitsiMeetJS from '../base/lib-jitsi-meet';

import { resetMedia } from '../base/media';

import {
    dominantSpeakerChanged,
    participantLeft,
    participantRoleChanged,
    participantVideoTypeChanged,
    remoteParticipantJoined
} from '../base/participants';

import {
    addTracksToConference,
    removeRemoteTracks,
    trackAdded,
    trackRemoved
} from '../base/tracks';

import {
    CONFERENCE_CREATED,
    CONFERENCE_JOINED,
    CONFERENCE_LEFT
} from './actionTypes';

import ConferenceConnector from './ConferenceConnector';

import './reducer';

const JitsiConferenceEvents = JitsiMeetJS.events.conference;
const JitsiTrackEvents = JitsiMeetJS.events.track;

/**
 * Returns conference options.
 *
 * @private
 * @returns {Object}
 */
function getConferenceOptions() {
    let options = config;

    if(config.enableRecording && !config.recordingType) {
        options.recordingType = (config.hosts &&
        (typeof config.hosts.jirecon !== 'undefined'))?
            'jirecon' : 'colibri';
    }

    return options;
}

/**
 * Setup various conference event handlers.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {Function} dispatch - Redux dispatch function.
 * @private
 * @returns {Function}
 */
function setupConferenceListeners(conference, dispatch) {
    // TODO: lots of stuff is missing here from jitsi-meet

    conference.on(JitsiConferenceEvents.CONFERENCE_JOINED,
        () => dispatch(conferenceJoined()));

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

    conference.on(JitsiConferenceEvents.TRACK_REMOVED,
        track => {
            if (!track || track.isLocal()) {
                return;
            }

            dispatch(trackRemoved(track));
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
}

/**
 * Create an action for when the signaling conference was left.
 *
 * @returns {{type: CONFERENCE_LEFT }}
 */
function conferenceLeft() {
    return {
        type: CONFERENCE_LEFT
    };
}

/**
 * Create an action for when the signaling conference was joined.
 *
 * @returns {{ type: CONFERENCE_JOINED }}
 */
function conferenceJoined() {
    return {
        type: CONFERENCE_JOINED
    };
}

/**
 * Create an action for when the signaling conference was created.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @returns {{ type: CONFERENCE_CREATED, conference: JitsiConference }}
 */
function conferenceCreated(conference) {
    return {
        type: CONFERENCE_CREATED,
        conference
    };
}

/**
 * Initializes a new conference.
 *
 * @param {string} room - Conference room name.
 * @returns {Function}
 */
export function create(room) {
    return (dispatch, getState) => {
        let connection = getState()['features/connection'];
        let conference;

        if (!connection) {
            throw new Error('Cannot create conference without connection');
        }

        conference = connection.initJitsiConference(
            room, getConferenceOptions());

        dispatch(conferenceCreated(conference));

        setupConferenceListeners(conference, dispatch);

        let localTracks = getState()['features/base/tracks']
            .filter(t => t.isLocal());

        if (localTracks.length) {
            addTracksToConference(conference, localTracks);
        }

        // TODO: currently this is not available
        //roomLocker = createRoomLocker(room);

        // TODO: currently this is not available
        // let email = APP.settings.getEmail();
        // email && sendData(this.commands.defaults.EMAIL, email);
        //
        // let avatarUrl = APP.settings.getAvatarUrl();
        // avatarUrl && sendData(this.commands.defaults.AVATAR_URL,
        //     avatarUrl);
        //
        // let nick = APP.settings.getDisplayName();
        // if (config.useNicks && !nick) {
        //     nick = APP.UI.askForNickname();
        //     APP.settings.setDisplayName(nick);
        // }
        // nick && room.setDisplayName(nick);

        return (new ConferenceConnector()).connect();
    };
}

/**
 * Leave the conference.
 *
 * @returns {Function}
 */
export function leave() {
    return (dispatch, getState) => {
        const conference = getState()['features/conference'];

        if (conference) {
            return conference.leave()
                .then(() => {
                    dispatch(resetMedia());
                    dispatch(removeRemoteTracks());

                    return dispatch(conferenceLeft());
                });
        }

        return Promise.resolve();
    };
}