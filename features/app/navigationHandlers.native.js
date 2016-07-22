import config from '../../config';

import {
    connect,
    disconnect
} from '../base/connection';
import { Conference } from '../conference';
import { WelcomePage } from '../welcome';

import { APP_SCREEN } from './constants';

export const navigationHandlers = {};

/**
 * Handler for APP_SCREEN.CONFERENCE screen route. Saves route to specified room
 * in navigation. Inits JitsiMeetJS and new conference.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @param {string} action.room - Room name.
 * @returns {void}
 */
navigationHandlers[APP_SCREEN.CONFERENCE] = (store, action) => {
    action.navigator.push({
        component: Conference,
        title: action.room
    });
    store.dispatch(connect(config, action.room));
};

/**
 * Handler for APP_SCREEN.WELCOME screen route. Saves root route in navigation.
 * Destroy connection, conference and local tracks.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @returns {void}
 */
navigationHandlers[APP_SCREEN.WELCOME] = (store, action) => {
    action.navigator.push({
        component: WelcomePage,
        title: 'Jitsi Meet'
    });
    store.dispatch(disconnect());
};
