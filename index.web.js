import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import {
    routerMiddleware,
    routerReducer
} from 'react-router-redux';
import {
    applyMiddleware,
    createStore
} from 'redux';
import Thunk from 'redux-thunk';

import Config from './config';
import { ReducerRegistry } from './features/base/redux';
import {
    App,
    navigationMiddleware
} from './features/app';

// Create combined reducer from all reducers in registry + routerReducer from
// 'react-router-redux' module (stores location updates from history).
// @see https://github.com/reactjs/react-router-redux#routerreducer.
const reducer = ReducerRegistry.combineReducers({
    routing: routerReducer
});

// Create Redux store with our reducer and additional middleware.
// For more information on Redux middleware
// @see http://redux.js.org/docs/advanced/Middleware.html.
// Here we have following middleware:
// - Thunk - allows us to dispatch async actions easily. For more info
// @see https://github.com/gaearon/redux-thunk.
// - navigationMiddleware - custom middleware to intercept routing actions.
// See implementation for more details.
// - routerMiddleware - middleware from 'react-router-redux' module to track
// changes in browser history inside Redux state. For more information
// @see https://github.com/reactjs/react-router-redux.
const store = createStore(
    reducer,
    applyMiddleware(
        Thunk, navigationMiddleware, routerMiddleware(browserHistory)));

// Render the root component.
ReactDOM.render(<App store={store} config={Config}/>, document.body);