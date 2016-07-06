import config from '../../config';
import JitsiMeetJS from '../base/lib-jitsi-meet';

import {
    initDeviceList,
    onDeviceListChanged,
    resetMedia
} from '../base/media';

import {
    dominantSpeakerChanged,
    localParticipantJoined,
    participantLeft,
    participantPinned,
    participantRoleChanged,
    participantSelected,
    participantVideoTypeChanged,
    remoteParticipantJoined,
    removeLocalParticipant
} from '../base/participants';

import {
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
const JitsiMediaDevicesEvents = JitsiMeetJS.events.mediaDevices;

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
        dispatch(localParticipantJoined(conference.myUserId()));

        setupConferenceListeners(conference, dispatch);

        dispatch(updateConferenceLocalTracks());

        if (JitsiMeetJS.mediaDevices.isDeviceListAvailable() &&
            JitsiMeetJS.mediaDevices.isDeviceChangeAvailable()) {
            JitsiMeetJS.mediaDevices.enumerateDevices(
                devices => dispatch(initDeviceList(devices)));

            JitsiMeetJS.mediaDevices.addEventListener(
                JitsiMediaDevicesEvents.DEVICE_LIST_CHANGED,
                (devices) => window.setTimeout(() => {
                    dispatch(onDeviceListChanged(devices))
                        .then(() => dispatch(updateConferenceLocalTracks()));
                }, 0)
            );
        }

        // TODO: dispatch an action if desktop sharing is enabled or not
        // this.isDesktopSharingEnabled =
        //     JitsiMeetJS.isDesktopSharingEnabled();

        if (config.iAmRecorder) {
            // TODO: init recorder
            //this.recorder = new Recorder();
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
                    dispatch(removeLocalParticipant());

                    return dispatch(conferenceLeft());
                });
        }

        return Promise.resolve();
    };
}

/**
 * Attach a current local tracks to a conference.
 *
 * @returns {Function}
 */
export function updateConferenceLocalTracks() {
    return (dispatch, getState) => {
        let conference = getState()['features/conference'];
        let localTracks = getState()['features/base/tracks']
            .filter(t => t.isLocal());
        let conferenceLocalTracks = conference.getLocalTracks();

        for (let track of localTracks) {
            // XXX The library lib-jitsi-meet may be draconian, for example,
            // when adding one and the same video track multiple times.
            if (-1 === conferenceLocalTracks.indexOf(track)) {
                conference.addTrack(track);
            }
        }
    };
}

/**
 * Create an action for when the user in conference is selected.
 *
 * @param {string|null} id - User id. If null, no one is selected.
 * @returns {Function}
 */
export function selectParticipant(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/conference'];

        conference && conference.selectParticipant(id);

        return dispatch(participantSelected(id));
    };
}

/**
 * Create an action for when the user in conference is pinned.
 *
 * @param {string|null} id - User id or null if no one is currently pinned.
 * @returns {Function}
 */
export function pinParticipant(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/conference'];
        let participants = getState()['features/base/participants'];
        let participant = participants.find(p => p.id === id);
        let localParticipant = participants.find(p => p.local);

        // This condition prevents signaling to pin local participant. Here is
        // the logic: if we have ID, then we check if participant by that ID is
        // local. If we don't have ID and thus no participant by ID, we check
        // for local participant. If it's currently pinned, then this action
        // will unpin him and that's why we won't signal here too.
        if ((participant && !participant.local) ||
            (!participant && (!localParticipant || !localParticipant.pinned))) {
            conference.pinParticipant(id);
        }

        return dispatch(participantPinned(id));
    };
}