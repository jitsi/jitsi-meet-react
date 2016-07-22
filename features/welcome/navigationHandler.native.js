import { ScreenRegistry } from '../base/navigation';
import { WELCOME_SCREEN } from './constants';

/**
 * Handler for welcome screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @returns {void}
 */
export function navigate(store, action) {
    let route = ScreenRegistry.getScreenByName(WELCOME_SCREEN);

    // TODO: currently replace method doesn't support animation, but work
    // towards adding it is done in
    // https://github.com/facebook/react-native/issues/1981
    action.navigator.replace(route);
}