import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import Thunk from 'redux-thunk';

import { ReducerRegistry } from './features/base/redux';
import Config from './config';
import {
    App,
    routerMiddleware as router
} from './features/app';

// Create combined reducer from all reducers in registry.
const reducer = ReducerRegistry.combineReducers();

// Create Redux store with our reducer and additional middleware.
// For more information on Redux middleware
// @see http://redux.js.org/docs/advanced/Middleware.html.
// Here we have following middleware:
// - Thunk - allows us to dispatch async actions easily. For more info
// @see https://github.com/gaearon/redux-thunk.
// - router - custom middleware to intercept routing actions. See implementation
// for more details.
const store = createStore(reducer, applyMiddleware(Thunk, router));

/**
 * React-Native doesn't support passing props to root component, so create
 * a wrapper class instead.
 */
class Root extends Component {
    /**
     * React component render method.
     *
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return <App store={store} config={Config}/>;
    }
}

// Register the root component.
AppRegistry.registerComponent('JitsiMeetApp', () => Root);