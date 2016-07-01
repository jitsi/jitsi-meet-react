import { push } from 'react-router-redux';
import { APP_NAVIGATE } from './actionTypes';
import { APP_SCREEN } from './constants';

/**
 * This router middleware is used for navigation inside the web app.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
export function routerMiddleware(store) {
    return next => action => {
        if (action.type === APP_NAVIGATE) {
            switch (action.screen) {
            case APP_SCREEN.HOME:
                return store.dispatch(push('/'));
            case APP_SCREEN.CONFERENCE:
                return store.dispatch(push('/' + action.room));
            }
        }

        return next(action);
    };
}