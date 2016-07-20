import config from '../../config';
import {
    destroy,
    init
} from '../base/connection';
import { ScreenRegistry } from '../base/navigation';
import { Conference } from './components';
import { CONFERENCE_SCREEN } from './constants';
import { navigate } from './navigationHandler';

/**
 * Conference app screen.
 *
 * @type {Screen}
 */
const ConferenceScreen = {
    component: Conference,
    name: CONFERENCE_SCREEN,
    navigate,
    /**
     * Inits new connection and conference when conference screen is entered.
     *
     * @param {Store} store - Redux store.
     * @returns {void}
     */
    onEnter(store) {
        // XXX If we enter conference directly through URL, we might not have
        // roomName in state yet. So getting it directly from location here.
        // In future app might also be able to launch conference directly
        // without entering the welcome page so this place might become an
        // extension point.
        let room = store.getState()['features/welcome'].roomName ||
            window.location.pathname.substr(1).toLowerCase();
        store.dispatch(init(config, room));
    },
    /**
     * Destroys connection, conference and local tracks when conference screen
     * is left.
     *
     * @param {Store} store - Redux store.
     * @returns {void}
     */
    onLeave(store) {
        store.dispatch(destroy());
    },
    path: '/:room'
};

/**
 * Register screen for conference page.
 */
ScreenRegistry.register(ConferenceScreen);