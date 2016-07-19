import { push } from 'react-router-redux';

import { APP_SCREEN } from './constants';

export const navigationHandlers = {};

/**
 * Handler for APP_SCREEN.CONFERENCE route. Dispatches 'react-router-redux' push
 * action with name of the room.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {string} action.room - Room name.
 * @returns {Function}
 */
navigationHandlers[APP_SCREEN.CONFERENCE] = (store, action) => {
    return store.dispatch(push('/' + action.room));
};

/**
 * Handler for APP_SCREEN.WELCOME route. Dispatches 'react-router-redux' push
 * action to root path.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
navigationHandlers[APP_SCREEN.WELCOME] = store => {
    return store.dispatch(push('/'));
};
