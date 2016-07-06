import { APP_NAVIGATE } from '../actionTypes';
import { navigationHandlers } from './navigationHandlers';

/**
 * This navigation middleware is used to track navigation routes inside both
 * native and web app.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
export function navigationMiddleware(store) {
    return next => action => {
        if (action.type === APP_NAVIGATE) {
            let handler = navigationHandlers[action.screen];

            if (handler) {
                return handler(store, action);
            }
        }

        return next(action);
    };
}