import { push } from 'react-router-redux';

/**
 * Handler for conference screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {string} action.room - Room name.
 * @returns {void}
 */
export function navigate(store, action) {
    return store.dispatch(push('/' + action.room));
}