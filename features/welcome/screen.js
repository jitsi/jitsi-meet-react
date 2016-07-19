import { ScreenRegistry } from '../base/navigation';
import { setRoomName } from './actions';
import { WELCOME_SCREEN } from './constants';
import { WelcomePage } from './components';
import { navigate } from './navigationHandler';

/**
 * Welcome page app screen.
 *
 * @type {Screen}
 */
const WelcomePageScreen = {
    component: WelcomePage,
    index: 0,
    navigate: navigate,
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
ScreenRegistry.register(WELCOME_SCREEN, WelcomePageScreen);