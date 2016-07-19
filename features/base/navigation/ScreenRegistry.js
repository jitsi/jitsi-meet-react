/**
 * Object describing application screen.
 *
 * @typedef {Object} Screen
 * @property {Component} component - React Component constructor.
 * @property {number} index - Screen index, required for React-Native Navigator.
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
         * The set of registered screens, keyed based on the screen name.
         */
        this.screenRegistry = {};
    }

    /**
     * Returns all registered screens.
     *
     * @returns {Screen[]}
     */
    getAllScreens() {
        return Object.keys(this.screenRegistry)
            .map(key => this.getScreenByName(key))
            .sort((s1, s2) => s1.index - s2.index);
    }

    /**
     * Returns all registered screens.
     *
     * @param {string} name - Screen name.
     * @returns {Screen|undefined}
     */
    getScreenByName(name) {
        let screen = this.screenRegistry[name];

        if (screen) {
            return {
                ...screen,
                name: name
            };
        }
    }

    /**
     * Adds a screen to the registry.
     *
     * @param {string} name - Screen name.
     * @param {Screen} screen - Screen definition object.
     * @returns {void}
     */
    register(name, screen) {
        if (this.screenRegistry[name]) {
            throw new Error(`Screen ${name} is already registered!`);
        }

        this.screenRegistry[name] = screen;
    }
}

/**
 * The public singleton instance of the ReducerRegistry class.
 */
export default new ScreenRegistry();
