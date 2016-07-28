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
 * React Native doesn't support specifying props to the main/root component (in
 * the JS/JSX source code). So create a wrapper React component (class) around
 * features/app's App instead (in the form of a stateless function).
 *
 * @param {Object} props - The read-only React Component props with which the
 * new instance is to be initialized.
 * @returns {ReactElement}
 */
const Root = props => <App { ...props } config={ config } store={ store } />;

// Register the root component.
AppRegistry.registerComponent('App', () => Root);
