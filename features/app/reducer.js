import { ReducerRegistry } from '../base/redux';

import { APP_START, APP_STOP } from './actionTypes';

/**
 * The initial Redux state of features/app.
 */
const INITIAL_STATE = {
    /**
     * The one and only (i.e. singleton) App instance which is currently
     * mounted.
     *
     * @type {(App|null)}
     */
    app: null
};

ReducerRegistry.register('features/app', (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case APP_START:
        if (state.app !== action.app) {
            return { ...state, app: action.app };
        }
        break;

    case APP_STOP:
        if (state.app === action.app) {
            return { ...state, app: INITIAL_STATE.app };
        }
        break;
    }

    return state;
});
