/**
 * Handler for native route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @param {Object} route - The route to navigate to.
 * @returns {void}
 */
export default function navigate(store, action, route) {
    // XXX React Native's Navigator adds properties to the route it's provided
    // with. Clone the specified route in order to prevent its modification.

    // TODO Currently, the replace method doesn't support animation. Work
    // towards adding it is done in
    // https://github.com/facebook/react-native/issues/1981
    action.navigator.replace({ ...route });
}
