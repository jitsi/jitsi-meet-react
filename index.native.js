import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore } from 'redux';
import Thunk from 'redux-thunk';

import config from './config';
import { App } from './features/app';
import {
    MiddlewareRegistry,
    ReducerRegistry
} from './features/base/redux';

// Create combined reducer from all reducers in registry.
const reducer = ReducerRegistry.combineReducers();

// Apply all registered middleware from the MiddlewareRegistry + additional
// 3rd party middleware:
// - Thunk - allows us to dispatch async actions easily. For more info
// @see https://github.com/gaearon/redux-thunk.
const middleware = MiddlewareRegistry.applyMiddleware(Thunk);

// Create Redux store with our reducer and middleware.
const store = createStore(reducer, middleware);

/**
 * React Native doesn't support passing props to root component, so create a
 * wrapper class instead in form of stateless function.
 *
 * @returns {ReactElement}
 */
const Root = () => <App config={config} store={store}/>;

// Register the root component.
AppRegistry.registerComponent('JitsiMeetApp', () => Root);
