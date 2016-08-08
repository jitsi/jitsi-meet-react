import { isRoomValid } from '../base/conference';
import { RouteRegistry } from '../base/navigator';
import { Conference } from '../conference';
import { WelcomePage } from '../welcome';

/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {Object} store - The Redux store which is to be depicted. In other
 * words, the Redux store into which the state to determine which route is to be
 * rendered is defined.
 * @returns {Route}
 */
export function _getRouteToRender(store) {
    const room = store.getState()['features/base/conference'].room;
    const component = isRoomValid(room) ? Conference : WelcomePage;

    return RouteRegistry.getRouteByComponent(component);
}
