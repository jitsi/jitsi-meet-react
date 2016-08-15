import { isRoomValid } from '../base/conference';
import { RouteRegistry } from '../base/navigator';
import { Conference } from '../conference';
import { WelcomePage } from '../welcome';

/**
 * Gets conference room name and connection domain from URL.
 *
 * @param {(string|undefined)} url - URL.
 * @returns {{
     *      domain: (string|undefined),
     *      room: (string|undefined)
     *  }}
 */
export function getRoomAndDomainFromUrlString(url) {
    return _getRoomAndDomainFromUrlObject(_urlStringToObject(url));
}

/**
 * Gets room name and domain from URL object.
 *
 * @param {URL} url - URL object.
 * @private
 * @returns {{
     *      domain: (string|undefined),
     *      room: (string|undefined)
     *  }}
 */
export function _getRoomAndDomainFromUrlObject(url) {
    let domain;
    let room;

    if (url) {
        domain = url.hostname;
        room = url.pathname.substr(1).toLowerCase();

        // Convert empty string to undefined to simplify checks.
        if (room === '') {
            room = undefined;
        }

        if (domain === '') {
            domain = undefined;
        }
    }

    return {
        domain,
        room
    };
}

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

/**
 * Parses a string into a URL (object).
 *
 * @param {(string|undefined)} url - The URL to parse.
 * @private
 * @returns {URL}
 */
function _urlStringToObject(url) {
    let urlObj;

    if (url) {
        try {
            urlObj = new URL(url);
        } catch (ex) {
            // The return value will signal the failure & the logged
            // exception will provide the details to the developers.
            console.warn(`Failed to parse URL: ${url}`, ex);
        }
    }

    return urlObj;
}
