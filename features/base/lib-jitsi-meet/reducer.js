import { ReducerRegistry } from '../redux';

import {
    LIB_DISPOSED,
    LIB_INIT_ERROR,
    LIB_INITIALIZED
} from './actionTypes';

/**
 * Initial state of 'features/base/lib'.
 *
 * @type {{
 *      initializationError: null,
 *      initialized: boolean
 * }}
 */
const INITIAL_STATE = {
    initializationError: null,
    initialized: false
};

ReducerRegistry.register('features/base/lib',
    (state = INITIAL_STATE, action) => {
        switch (action.type) {
        case LIB_DISPOSED:
            return INITIAL_STATE;
        case LIB_INIT_ERROR:
            return {
                ...state,
                initializationError: action.lib.error,
                initialized: false
            };

        case LIB_INITIALIZED:
            return {
                ...state,
                initializationError: null,
                initialized: true
            };

        default:
            return state;
        }
    });