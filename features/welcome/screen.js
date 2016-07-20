import { ScreenRegistry } from '../base/navigation';
import { setRoomName } from './actions';
import { WelcomePage } from './components';
import { WELCOME_SCREEN } from './constants';
import { navigate } from './navigationHandler';

/**
 * Welcome page app screen.
 *
 * @type {Screen}
 */
const WelcomePageScreen = {
    component: WelcomePage,
    name: WELCOME_SCREEN,
    navigate,
    /**
     * Resets room name to empty string when welcome page screen is entered.
     *
     * @param {Store} store - Redux store.
     * @returns {void}
     */
    onEnter(store) {
        store.dispatch(setRoomName(''));
    },
    /**
     * Does nothing when welcome page is left.
     *
     * @returns {void}
     */
    onLeave() {},
    path: '/'
};

/**
 * Register screen for welcome page.
 */
ScreenRegistry.register(WelcomePageScreen);