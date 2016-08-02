import { push } from 'react-router-redux';

/**
 * Handler for conference screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {string} action.room - Room name.
 * @param {Object} route - The route to navigate to.
 * @returns {void}
 */
export default function navigate(store, action, route) {
    let path = route.path;

    // The syntax :room bellow is defined by react-router. It "matches a URL
    // segment up to the next /, ?, or #. The matched string is called a param."

    // XXX The APP_NAVIGATE action is defined by this feature to have a room
    // property. The following may be generalized to replace any react-router
    // param with the value of the action property with the same name.
    path = path.replace(/:room/g, action.room);

    return store.dispatch(push(path));
}
