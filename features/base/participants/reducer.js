import { ReducerRegistry } from '../redux';

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ADDED,
    PARTICIPANT_PINNED,
    PARTICIPANT_REMOVED,
    PARTICIPANT_ROLE_CHANGED,
    PARTICIPANT_VIDEO_STARTED
} from './actionTypes';

/**
 * Participant object.
 * @typedef {Object} Participant
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} role
 * @property {boolean} local
 * @property {boolean} pinned
 * @property {boolean} pinned
 * @property {boolean} videoStarted
 */

/**
* Actions for a single participant.
* @param {Participant|undefined} state
* @param {Object} action
* @param {string} action.type
* @param {Participant} action.participant
* @returns {Participant|undefined}
 */
function participant(state, action) {
    switch (action.type) {
    case PARTICIPANT_ADDED:
        return {
            id: action.participant.id,
            name: action.participant.name,
            avatar: action.participant.avatar,
            role: action.participant.role,
            local: action.participant.local || false,
            pinned: action.participant.pinned || false,
            speaking: action.participant.speaking || false,
            videoStarted: false
        };
    case DOMINANT_SPEAKER_CHANGED:
        // Only one dominant speaker is allowed.
        return Object.assign({}, state, {
            speaking: state.id === action.participant.id
        });
    case PARTICIPANT_PINNED:
        // Currently only one pinned participant is allowed.
        return Object.assign({}, state, {
            pinned: state.id === action.participant.id
        });
    case PARTICIPANT_VIDEO_STARTED:
        if (state.id === action.participant.id) {
            return Object.assign({}, state, { videoStarted: true });
        }

        return state;
    case PARTICIPANT_ROLE_CHANGED:
        // TODO: check how actually roles change!!
        return state;
    default:
        return state;
    }
}

/**
* Listen for actions which add, remove, or update the set of participants
* in the conference.
* @param {Participant[]} state
* @param {Object} action
* @param {string} action.type
* @param {Participant} action.participant
* @returns {Participant[]}
*/
ReducerRegistry.register('features/base/participants', (state = [], action) => {
    switch (action.type) {
    case PARTICIPANT_ADDED:
        return [ ...state, participant(undefined, action) ];
    case PARTICIPANT_REMOVED:
        return state.filter(p => p.id !== action.participant.id);
    case DOMINANT_SPEAKER_CHANGED:
    case PARTICIPANT_PINNED:
    case PARTICIPANT_ROLE_CHANGED:
    case PARTICIPANT_VIDEO_STARTED:
        return state.map(p => participant(p, action));
    default:
        return state;
    }
});
