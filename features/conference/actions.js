import JitsiMeetJS from '../base/lib-jitsi-meet';

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

import { resetToolbar } from '../toolbar';

import {
    JITSI_CONFERENCE_JOINED,
    JITSI_CONFERENCE_LEFT
} from './actionTypes';

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
 * Create an action for when the signaling conference was left.
 *
 * @returns {{type: JITSI_CONFERENCE_LEFT, message: string}}
 */
export function conferenceLeft() {
    return dispatch => {
        dispatch(resetToolbar());

        return dispatch(removeRemoteTracks())
            .then(() => dispatch({ type: JITSI_CONFERENCE_LEFT }));
    };
}

/**
 * Leave the conference.
 *
 * @returns {Function}
 */
export function leaveConference() {
    return (dispatch, getState) => {
        const conference = getState()['features/conference'];

        if (conference) {
            return conference.leave()
                .then(() => dispatch(conferenceLeft()));
        }

        return Promise.resolve();
    };
}