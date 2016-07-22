import config from '../../config';

import {
    destroy,
    init
} from '../base/connection';
import { Conference } from '../conference';
import { 
    setRoomName, 
    WelcomePage 
} from '../welcome';

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
    let conferenceRoute = action.navigator.getCurrentRoutes()
        .find(r => r.component === Conference);

    // XXX We are using jumpTo() method instead of push/pop in order
    // not to create new scenes. In this case WelcomePage and Conference
    // components will be mounted only once and then they will be just
    // updated whenever Redux state changes.
    action.navigator.jumpTo(conferenceRoute);

    store.dispatch(init(config, action.room));
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
    let welcomePageRoute = action.navigator.getCurrentRoutes()
        .find(r => r.component === WelcomePage);

    // XXX We are using jumpTo() method instead of push/pop in order
    // not to create new scenes. In this case WelcomePage and Conference
    // components will be mounted only once and then they will be just
    // updated whenever Redux state changes.
    action.navigator.jumpTo(welcomePageRoute);

    store.dispatch(setRoomName(''));
    store.dispatch(destroy());
};
