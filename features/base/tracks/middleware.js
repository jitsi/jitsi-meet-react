import {
    LIB_DISPOSED,
    LIB_INITIALIZED
} from '../lib-jitsi-meet';
import { MiddlewareRegistry } from '../redux';

import {
    createLocalTracks,
    destroyLocalTracks
} from './actions';

/**
 * Middleware that captures LIB_INITIALIZED and LIB_DISPOSED actions
 * and respectively creates/destroys local media tracks.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
const tracksMiddleware = store => next => action => {
    switch (action.type) {
    case LIB_INITIALIZED:
        store.dispatch(createLocalTracks());
        break;

    case LIB_DISPOSED:
        store.dispatch(destroyLocalTracks());
        break;
    }

    return next(action);
};

MiddlewareRegistry.register(tracksMiddleware);
