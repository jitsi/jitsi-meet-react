import { CONFERENCE_SCREEN } from './constants';

/**
 * Handler for conference screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @returns {void}
 */
export function navigate(store, action) {
    let route = action.navigator.getCurrentRoutes()
        .find(r => r.name === CONFERENCE_SCREEN);
    action.navigator.jumpTo(route);
}