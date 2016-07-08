import { CONFERENCE_LEFT } from '../conference';
import { CONNECTION_DISCONNECTED } from '../connection';
import { ReducerRegistry } from '../redux';

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_FOCUSED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_SELECTED,
    PARTICIPANT_UPDATED
} from './actionTypes';

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
 * @property {boolean} focused - If true, participant is currently visually
 *      selected on UI.
 * @property {boolean} selected - If true, participant is current
 *      "SELECTED_ENDPOINT".
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
    'id', 'local', 'pinned', 'speaking', 'focused'];

/**
 * Reducer function for a single participant.
 *
 * @param {Participant|undefined} state - Participant to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Participant} action.participant - Information about participant to be
 * added/modified.
 * @returns {Participant|undefined}
 */
function participant(state, action) {
    switch (action.type) {
    case DOMINANT_SPEAKER_CHANGED:
        // Only one dominant speaker is allowed.
        return Object.assign({}, state, {
            speaking: state.id === action.participant.id
        });

    case PARTICIPANT_JOINED:
        return {
            id: action.participant.id,
            avatar: action.participant.avatar,
            focused: action.participant.focused || false,
            local: action.participant.local || false,
            name: action.participant.name,
            pinned: action.participant.pinned || false,
            role: action.participant.role,
            selected: action.participant.selected || false,
            speaking: action.participant.speaking || false,
            videoStarted: false,
            videoType: action.participant.videoType || undefined
        };

    case PARTICIPANT_FOCUSED:
        // Currently only one focused participant is allowed.
        return Object.assign({}, state, {
            focused: state.id === action.participant.id
        });

    case PARTICIPANT_PINNED:
        // Currently only one pinned participant is allowed.
        return Object.assign({}, state, {
            pinned: state.id === action.participant.id
        });

    case PARTICIPANT_SELECTED:
        // Currently only one selected participant is allowed.
        return Object.assign({}, state, {
            selected: state.id === action.participant.id
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

            return Object.assign({}, state, updateObj);
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

    /**
     * Remove all participants when connection is disconnected.
     */
    case CONNECTION_DISCONNECTED:
        return [];

    /**
     * Remove remote participants when conference is left.
     */
    case CONFERENCE_LEFT:
        return state.filter(p => p.local);

    case DOMINANT_SPEAKER_CHANGED:
    case PARTICIPANT_FOCUSED:
    case PARTICIPANT_PINNED:
    case PARTICIPANT_SELECTED:
    case PARTICIPANT_UPDATED:
        return state.map(p => participant(p, action));

    default:
        return state;
    }
});
