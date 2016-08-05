import { SET_ROOM } from '../base/conference';
import { MiddlewareRegistry } from '../base/redux';

import { appNavigate } from './actions';
import { APP_NAVIGATE } from './actionTypes';
import { _getRouteToRender } from './functions';

/**
 * Implements middleware to abstract navigation inside the app for both native
 * and web.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case APP_NAVIGATE: {
        let app = store.getState()['features/app'].app;

        app.navigate(action.route);
        break;
    }

    case SET_ROOM: {
        // When (the name of) the room of the conference (to be) joined changes,
        // navigate to the route appropriate to depict the current state.

        // TODO Technically, having a piece of middleware to intercept changes
        // in a Redux state may be viewed as bad design because one may instead
        // define a React component to be automatically (re)rendered upon such
        // changes.
        // TODO Instead of intercepting SET_ROOM, a cleaner design may be to
        // introduce a ROOM_CHANGED action in features/base/conference that is
        // dispatched iff SET_ROOM causes an actual change in the value of the
        // room state.

        let oldRoom = store.getState()['features/base/conference'].room;
        let r = next(action);
        let newRoom = store.getState()['features/base/conference'].room;

        if (oldRoom !== newRoom) {
            store.dispatch(appNavigate(_getRouteToRender(store)));
        }
        return r;
    }
    }

    return next(action);
});
