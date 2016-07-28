import JitsiMeetJS from '../lib-jitsi-meet';
import {
    changeParticipantEmail,
    dominantSpeakerChanged,
    participantLeft,
    participantRoleChanged,
    participantVideoTypeChanged,
    remoteParticipantJoined
} from '../participants';
import {
    addTracksToConference,
    trackAdded,
    trackMuteChanged,
    trackRemoved
} from '../tracks';

import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    ROOM_SET
} from './actionTypes';
import { EMAIL_COMMAND } from './constants';
import './reducer';

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
        conference.on(JitsiConferenceEvents.CONFERENCE_LEFT,
            () => dispatch(conferenceLeft(conference)));

        conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
            id => dispatch(dominantSpeakerChanged(id)));

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
        conference.on(JitsiConferenceEvents.TRACK_MUTE_CHANGED,
            track => dispatch(trackMuteChanged(track)));
        conference.on(JitsiConferenceEvents.TRACK_REMOVED,
            track => {
                if (!track || track.isLocal()) {
                    return;
                }

                dispatch(trackRemoved(track));
            });

        conference.on(JitsiConferenceEvents.USER_JOINED,
            (id, user) => dispatch(remoteParticipantJoined(id, {
                role: user.getRole(),
                displayName: user.getDisplayName()
            })));
        conference.on(JitsiConferenceEvents.USER_LEFT,
            id => dispatch(participantLeft(id)));
        conference.on(JitsiConferenceEvents.USER_ROLE_CHANGED,
            (id, role) => dispatch(participantRoleChanged(id, role)));

        conference.addCommandListener(EMAIL_COMMAND, (data, id) => {
            dispatch(changeParticipantEmail(id, data.value));
        });

        conference.join();
    };
}

/**
 * Attach any pre-existing local media to the conference once the
 * conference has been joined.
 *
 * @param {JitsiConference} conference - The JitsiConference instance which was
 * joined by the local participant.
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
            type: CONFERENCE_JOINED,
            conference: {
                jitsiConference: conference
            }
        });
    };
}

/**
 * Signal that we have left the conference.
 *
 * @param {JitsiConference} conference - The JitsiConference instance which was
 * left by the local participant.
 * @returns {{
 *      type: CONFERENCE_LEFT,
 *      conference: {
 *          jitsiConference: JitsiConference
 *      }
 *  }}
 */
export function conferenceLeft(conference) {
    return {
        type: CONFERENCE_LEFT,
        conference: {
            jitsiConference: conference
        }
    };
}

/**
 * Signals that room name was set.
 *
 * @param {string} room - Name of conference room.
 * @returns {{
 *      type: ROOM_SET,
 *      conference: {
 *          room: string
 *      }
 *  }}
 */
export function roomSet(room) {
    return {
        type: ROOM_SET,
        conference: {
            room
        }
    };
}
