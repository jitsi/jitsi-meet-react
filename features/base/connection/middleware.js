import { SET_CONFIG } from '../lib-jitsi-meet';
import { MiddlewareRegistry } from '../redux';

import { setDomain } from './actions';

/**
 * Middleware that captures SET_CONFIG action and dispatches CHANGE_DOMAIN
 * action.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case SET_CONFIG:
        store.dispatch(setDomain(action.config.hosts.domain));
        break;
    }

    return next(action);
});
