import Config from '../../../config';

import {
    destroy,
    init
} from '../../base/connection';
import { Conference } from '../../conference';
import { WelcomePage } from '../../welcome';

import { APP_SCREEN } from '../constants';

const navigationHandlers = {};

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
        title: 'Jitsi Meet',
        component: WelcomePage
    });
    store.dispatch(destroy());
};

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
        title: action.room,
        component: Conference
    });
    store.dispatch(init(Config, action.room));
};

export { navigationHandlers };