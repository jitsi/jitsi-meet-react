/* global MD5 */

import {
    CONFERENCE_JOINED,
    CONFERENCE_LEFT
} from '../conference';
import { ReducerRegistry } from '../redux';

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import {
    LOCAL_PARTICIPANT_DEFAULT_ID,
    PARTICIPANT_ROLE
} from './constants';

/**
 * Participant object.
 * @typedef {Object} Participant
 * @property {string} id - Participant ID.
 * @property {string} name - Participant name.
 * @property {string} avatar - Path to participant avatar if any.
 * @property {string} role - Participant role.
 * @property {boolean} local - If true, participant is local.
 * @property {boolean} pinned - If true, participant is current
 *      "PINNED_ENDPOINT".
 * @property {boolean} speaking - If true, participant is currently a
 *      dominant speaker.
 * @property {boolean} videoStarted -  If true, participant video stream has
 *      already started.
 * @property {('camera'|'desktop'|undefined)} videoType - Type of participant's
 *      current video stream if any.
 * @property {string} email - participant email.
 */

/**
 * These properties should not be bulk assigned when updating a particular
 * @see Participant.
 * @type {string[]}
 */
const PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE = [
    'id', 'local', 'pinned', 'speaking'];

/**
 * Reducer function for a single participant.
 *
 * @param {Participant|undefined} state - Participant to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Participant} action.participant - Information about participant to be
 * added/modified.
 * @param {JitsiConference} action.conference - Conference instance.
 * @returns {Participant|undefined}
 */
function participant(state, action) {
    switch (action.type) {
    /**
     * Sets participant id according to conference.
     */
    case CONFERENCE_JOINED:
        if (state.local) {
            let id = action.conference.jitsiConference.myUserId();

            return {
                ...state,
                id,
                avatar: state.avatar || _getAvatarURL(id, state.email)
            };
        }

        return state;
    /**
     * Cleans conference-specific properties of the local participant when
     * conference is left.
     */
    case CONFERENCE_LEFT:
        if (state.local) {
            return {
                ...state,
                id: LOCAL_PARTICIPANT_DEFAULT_ID,
                avatar: state.avatar ||
                    _getAvatarURL(LOCAL_PARTICIPANT_DEFAULT_ID, state.email),
                focused: false,
                pinned: false,
                role: PARTICIPANT_ROLE.NONE,
                selected: false,
                speaking: false
            };
        }

        return state;

    case DOMINANT_SPEAKER_CHANGED:
        // Only one dominant speaker is allowed.
        return Object.assign({}, state, {
            speaking: state.id === action.participant.id
        });

    case PARTICIPANT_JOINED:
        return {
            id: action.participant.id,
            avatar: action.participant.avatar ||
                _getAvatarURL(action.participant.id, action.participant.email),
            email: action.participant.email,
            local: action.participant.local || false,
            name: action.participant.name,
            pinned: action.participant.pinned || false,
            role: action.participant.role || PARTICIPANT_ROLE.NONE,
            speaking: action.participant.speaking || false,
            videoStarted: false,
            videoType: action.participant.videoType || undefined
        };

    case PARTICIPANT_PINNED:
        // Currently only one pinned participant is allowed.
        return Object.assign({}, state, {
            pinned: state.id === action.participant.id
        });

    case PARTICIPANT_UPDATED:
        if (state.id === action.participant.id) {
            let updateObj = {};

            for (let key in action.participant) {
                if (action.participant.hasOwnProperty(key) &&
                    PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE.indexOf(key) === -1) {
                    updateObj[key] = action.participant[key];
                }
            }

            updateObj = Object.assign({}, state, updateObj);

            updateObj.avatar = updateObj.avatar
                || _getAvatarURL(action.participant.id, updateObj.email);

            return updateObj;
        }
        return state;

    default:
        return state;
    }
}

/**
 * Listen for actions which add, remove, or update the set of participants
 * in the conference.
 *
 * @param {Participant[]} state - List of participants to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Participant} action.participant - Information about participant to be
 * added/removed/modified.
 * @returns {Participant[]}
 */
ReducerRegistry.register('features/base/participants', (state = [], action) => {
    switch (action.type) {
    case PARTICIPANT_JOINED:
        return [ ...state, participant(undefined, action) ];

    case PARTICIPANT_LEFT:
        return state.filter(p => p.id !== action.participant.id);

    case CONFERENCE_JOINED:
    case CONFERENCE_LEFT:
    case DOMINANT_SPEAKER_CHANGED:
    case PARTICIPANT_PINNED:
    case PARTICIPANT_UPDATED:
        return state.map(p => participant(p, action));

    default:
        return state;
    }
});

/**
 * Returns the URL of the image for the avatar of a particular participant
 * identified by their id and/or e-mail address.
 *
 * @param {string} participantId - Participant's id.
 * @param {string} [email] - Participant's email.
 * @returns {string} The URL of the image for the avatar of the participant
 * identified by the specified participantId and/or email.
 */
function _getAvatarURL(participantId, email) {
    // TODO: Use disableThirdPartyRequests config

    let avatarId = email || participantId;

    // If the ID looks like an email, we'll use gravatar.
    // Otherwise, it's a random avatar, and we'll use the configured
    // URL.
    let random = !avatarId || avatarId.indexOf('@') < 0;

    if (!avatarId) {
        avatarId = participantId;
    }
    // MD5 is provided by Strophe
    avatarId = MD5.hexdigest(avatarId.trim().toLowerCase());

    let urlPref = null;
    let urlSuf = null;
    if (!random) {
        urlPref = 'https://www.gravatar.com/avatar/';
        urlSuf = '?d=wavatar&size=200';
    }
    // TODO: Use RANDOM_AVATAR_URL_PREFIX from interface config
    else {
        urlPref = 'https://robohash.org/';
        urlSuf = '.png?size=200x200';
    }

    return urlPref + avatarId + urlSuf;
}