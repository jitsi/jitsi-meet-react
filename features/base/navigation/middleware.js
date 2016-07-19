import { MiddlewareRegistry } from '../redux';

import { APP_NAVIGATE } from './actionTypes';
import ScreenRegistry from './ScreenRegistry';

/**
 * This router middleware is used to abstract navigation inside the app for both
 * native and web.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
const router = store => next => action => {
    if (action.type === APP_NAVIGATE) {
        let screen = ScreenRegistry.getScreenByName(action.screen);

        if (screen && screen.navigate) {
            return screen.navigate(store, action);
        }
    }

    return next(action);
};

MiddlewareRegistry.register(router);
