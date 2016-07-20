/**
 * Object describing application screen.
 *
 * @typedef {Object} Screen
 * @property {Component} component - React Component constructor.
 * @property {string} name - Screen name.
 * @property {Function} navigate - Function to execute to navigate to
 * this screen.
 * @property {Function} onEnter - Function to execute when screen is entered.
 * @property {Function} onLeave - Function to execute when screen is left.
 * @property {string} path - URL route, required for web routing.
 */

/**
 * A registry for application screens, allowing features to register themselves
 * without needing to create additional inter-feature dependencies.
 */
class ScreenRegistry {
    /**
     * Creates a ScreenRegistry instance.
     */
    constructor() {
        /**
         * The set of registered screens.
         *
         * @private
         */
        this._screenRegistry = new Set();
    }

    /**
     * Returns all registered screens.
     *
     * @returns {Screen[]}
     */
    getAllScreens() {
        // We use destructuring operator to 'clone' screen object to prevent
        // modifications from outside (e.g. React-Native's Navigator extends
        // it with some additional properties).
        return [ ...this._screenRegistry ]
            .map(screen => { return { ...screen }; });
    }

    /**
     * Returns screen by name if any.
     *
     * @param {string} name - Screen name.
     * @returns {Screen|null}
     */
    getScreenByName(name) {
        let screen = [ ...this._screenRegistry ].find(s => s.name === name);

        // We use destructuring operator to 'clone' screen object to prevent
        // modifications from outside (e.g. React-Native's Navigator extends
        // it with some additional properties).
        return screen
            ? { ...screen }
            : null;
    }

    /**
     * Adds a screen to the registry.
     *
     * @param {Screen} screen - Screen definition object.
     * @returns {void}
     */
    register(screen) {
        if (this._screenRegistry.has(screen)) {
            throw new Error(`Screen ${screen.name} is already registered!`);
        }

        this._screenRegistry.add(screen);
    }
}

/**
 * The public singleton instance of the ReducerRegistry class.
 */
export default new ScreenRegistry();
