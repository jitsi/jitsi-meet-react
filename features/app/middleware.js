import { MiddlewareRegistry } from '../base/redux';

import { APP_NAVIGATE } from './actionTypes';
import { navigationHandlers } from './navigationHandlers';

/**
 * This router middleware is used to abstract navigation inside the app for both
 * native and web.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
const router = store => next => action => {
    if (action.type === APP_NAVIGATE) {
        let handler = navigationHandlers[action.screen];

        if (handler) {
            return handler(store, action);
        }
    }

    return next(action);
};

MiddlewareRegistry.register(router);
