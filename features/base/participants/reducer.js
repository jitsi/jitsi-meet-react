import { ReducerRegistry } from '../redux';

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ADDED,
    PARTICIPANT_FOCUSED,
    PARTICIPANT_PINNED,
    PARTICIPANT_REMOVED,
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

    case PARTICIPANT_ADDED:
        return {
            id: action.participant.id,
            name: action.participant.name,
            avatar: action.participant.avatar,
            role: action.participant.role,
            local: action.participant.local || false,
            pinned: action.participant.pinned || false,
            speaking: action.participant.speaking || false,
            focused: action.participant.focused || false,
            selected: action.participant.selected || false,
            videoType: action.participant.videoType || undefined,
            videoStarted: false
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
    case PARTICIPANT_ADDED:
        return [ ...state, participant(undefined, action) ];

    case PARTICIPANT_REMOVED:
        return state.filter(p => p.id !== action.participant.id);

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
