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
    path: '/:room'
};

/**
 * Register screen for conference page.
 */
ScreenRegistry.register(ConferenceScreen);
