import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT
} from '../participants';
import { MiddlewareRegistry } from '../redux';

import {
    disposeLib,
    initLib
} from './actions';

/**
 * Middleware that captures PARTICIPANT_JOINED and PARTICIPANT_LEFT actions for
 * a local participant and respectively initializes/disposes lib-jitsi-meet.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
const libMiddleware = store => next => action => {
    switch (action.type) {
    case PARTICIPANT_JOINED:
        if (action.participant.local) {
            store.dispatch(initLib());
        }
        break;

    case PARTICIPANT_LEFT:
        if (action.participant.local) {
            store.dispatch(disposeLib());
        }
        break;
    }

    return next(action);
};

MiddlewareRegistry.register(libMiddleware);