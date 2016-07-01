import { APP_NAVIGATE } from './actionTypes';
import { APP_SCREEN } from './constants';
import { WelcomePage } from '../welcome';
import { Conference } from '../conference';

/**
 * This router middleware is used to track navigation routes inside the native
 * app.
 *
 * @returns {Function}
 */
export function routerMiddleware() {
    return next => action => {
        if (action.type === APP_NAVIGATE) {
            switch (action.screen) {
            case APP_SCREEN.HOME:
                return action.navigator.push({
                    title: 'Jitsi Meet',
                    component: WelcomePage
                });
            case APP_SCREEN.CONFERENCE:
                action.navigator.push({
                    title: action.room,
                    component: Conference
                });
                return;
            }
        }
        return next(action);
    };
}