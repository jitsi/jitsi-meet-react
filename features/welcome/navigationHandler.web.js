import { push } from 'react-router-redux';

/**
 * Handler for welcome screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @returns {void}
 */
export function navigate(store, action) { // eslint-disable-line no-unused-vars
    return store.dispatch(push('/'));
}