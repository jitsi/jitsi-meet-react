import { combineReducers } from 'redux';

/**
 * A registry for Redux reducers, allowing features to register themselves
 * without needing to create additional inter-feature dependencies.
 */
class ReducerRegistry {

    /**
     * Creates a ReducerRegistry instance.
     *
     * @constructor
     */
    constructor() {
        /**
         * The set of registered reducers, keyed based on the field each reducer
         * will manage.
         */
        this.reducerRegistry = {};
    }

    /**
     * Combines all registered reducers into a single reducing function.
     *
     * @param {object} additional = {} - Any additional reducers that need to be
     * included (such as reducers from third-party modules).
     */
    combineReducers(additional = {}) {
        return combineReducers({
            ...this.reducerRegistry,
            ...additional
        });
    }

    /**
     * Adds a reducer to the registry.
     *
     * @param {string} name - The field in the state object that will be managed
     * by the provided reducer.
     * @param reducer {Function} A Redux reducer
     */
    register(name, reducer) {
        this.reducerRegistry[name] = reducer;
    }
}

/**
 * The public singleton instance of the ReducerRegistry class.
 */
export default new ReducerRegistry();
