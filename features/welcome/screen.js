import { ScreenRegistry } from '../base/navigation';
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
    path: '/'
};

/**
 * Register screen for welcome page.
 */
ScreenRegistry.register(WelcomePageScreen);