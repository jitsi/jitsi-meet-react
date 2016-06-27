import { combineReducers } from 'redux';

/**
 * A registry for Redux reducers, allowing features to register themselves
 * without needing to create additional inter-feature dependencies.
 */
const Registry = {
    /**
     * The set of registered reducers, keyed based on the field each
     * reducer will manage.
     */ 
    reducers: {},

    /**
     * Add a reducer to the registry.
     *
     * @param {string} name - The field in the state object that will be
     *      managed by the provided reducer.
     * @param reducer {Function} A Redux reducer
     */
    register: function (name, reducer) {
        this.reducers[name] = reducer;
    },

    /**
     * Combine all registered reducers into a single reducing function.
     *
     * @param {object} additional = {} - Any additional reducers that need to
     *      be included (such as reducers from third-party modules). 
     */
    getReducer: function (additional = {}) {
        return combineReducers({
            ...this.reducers,
            ...additional
        });
    }
};


export default Registry;

