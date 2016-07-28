/**
 * Handler for welcome screen route.
 *
 * @param {Store} store - Redux store.
 * @param {Object} action - Action object.
 * @param {Navigator} action.navigator - Navigator instance.
 * @returns {void}
 */
export function navigate(store, action) {
    // TODO: currently replace method doesn't support animation, but work
    // towards adding it is done in
    // https://github.com/facebook/react-native/issues/1981
    action.navigator.replace({ ...this });
}
