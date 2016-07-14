import Config from '../../../config';

import { init } from '../../base/connection';
import { Conference } from '../../conference';
import { WelcomePage } from '../../welcome';

import { APP_SCREEN } from '../constants';

const navigationHandlers = {};

/**
 * Handler for APP_SCREEN.WELCOME screen route. Saves root route in navigation.
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
};

/**
 * Handler for APP_SCREEN.CONFERENCE screen route. Saves route to specified room
 * in navigation.
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

