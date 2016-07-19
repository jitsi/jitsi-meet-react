import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import {
    routerMiddleware,
    routerReducer
} from 'react-router-redux';
import { createStore } from 'redux';
import Thunk from 'redux-thunk';

import config from './config';
import { App } from './features/app';
import {
    MiddlewareRegistry,
    ReducerRegistry
} from './features/base/redux';

import './features/conference';
import './features/welcome';

// Create combined reducer from all reducers in registry + routerReducer from
// 'react-router-redux' module (stores location updates from history).
// @see https://github.com/reactjs/react-router-redux#routerreducer.
const reducer = ReducerRegistry.combineReducers({
    routing: routerReducer
});

// Apply all registered middleware from the MiddlewareRegistry + additional
// 3rd party middleware:
// - Thunk - allows us to dispatch async actions easily. For more info
// @see https://github.com/gaearon/redux-thunk.
// - routerMiddleware - middleware from 'react-router-redux' module to track
// changes in browser history inside Redux state. For more information
// @see https://github.com/reactjs/react-router-redux.
const middleware = MiddlewareRegistry.applyMiddleware(
    Thunk, routerMiddleware(browserHistory));

// Create Redux store with our reducer and middleware.
const store = createStore(reducer, middleware);

// Render the root component.
ReactDOM.render(<App config={config} store={store}/>, document.body);
