import { setRoom } from '../base/conference';
import {
    getDomain,
    setDomain
} from '../base/connection';
import { WelcomePage } from '../welcome';

import {
    APP_WILL_MOUNT,
    APP_WILL_UNMOUNT
} from './actionTypes';
import {
    _getRouteToRender,
    _getRoomAndDomainFromUrlString
} from './functions';
import './reducer';

/**
 * Triggers an in-app navigation to a different route. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {(string|undefined)} urlOrRoom - The url or room name to which to
 * navigate.
 * @returns {Function}
 */
export function appNavigate(urlOrRoom) {
    return (dispatch, getState) => {
        let state = getState();
        const oldDomain = getDomain(state);
        const oldRoom = state['features/base/conference'].room;

        const { domain, room } = _getRoomAndDomainFromUrlString(urlOrRoom);

        // If both domain and room vars became undefined, that means we're
        // actually dealing with just room name and not with URL.
        if (typeof domain === 'undefined' && typeof room === 'undefined') {
            dispatch(setRoom(urlOrRoom));
        } else {
            // It doesn't make sense to update to undefined domain.
            if (typeof domain !== 'undefined') {
                dispatch(setDomain(domain));
            }

            dispatch(setRoom(room));
        }

        state = getState();
        const newDomain = getDomain(state);
        const newRoom = state['features/base/conference'].room;
        const routeToRender = _getRouteToRender(state);

        // TODO Kostiantyn Tsaregradskyi: We should probably detect if user is
        // currently in a conference and ask her if she wants to close the
        // current conference and start a new one with the new room name.

        // XXX If domain changed while we're on Welcome page it makes no sense
        // to re-navigate to Welcome page.
        if (oldRoom !== newRoom
            || (oldDomain !== newDomain
                && routeToRender.component !== WelcomePage)) {
            const app = state['features/app'].app;

            app._navigate(routeToRender);
        }
    };
}

/**
 * Signals that a specific App will mount (in the terms of React).
 *
 * @param {App} app - The App which will mount.
 * @returns {{
 *     type: APP_WILL_MOUNT,
 *     app: App
 * }}
 */
export function appWillMount(app) {
    return {
        type: APP_WILL_MOUNT,
        app
    };
}

/**
 * Signals that a specific App will unmount (in the terms of React).
 *
 * @param {App} app - The App which will unmount.
 * @returns {{
 *     type: APP_WILL_UNMOUNT,
 *     app: App
 * }}
 */
export function appWillUnmount(app) {
    return {
        type: APP_WILL_UNMOUNT,
        app
    };
}
