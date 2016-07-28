import React, { Component } from 'react';
import { AppRegistry, Linking } from 'react-native';
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
 * features/app's App instead.
 *
 * @extends Component
 */
class Root extends Component {
    /**
     * Initializes a new Root instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        /**
         * Initial state of component.
         *
         * @type {{url: undefined}}
         */
        this.state = {
            url: undefined
        };
    }

    /**
     * Retrieve initial URL from Linking module and set it to state. This will
     * actually 'launch' the app.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        Linking.getInitialURL()
            .then(url => this.setState({ url }))
            .catch(err => {
                console.error('failed to get initial url', err);
                // XXX Start with empty URL if we failed to get the initial one
                // for any reason.
                this.setState({ url: null });
            });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // XXX We don't render the <App> component until we've get the initial
        // url, either it's null or some value;
        if (typeof this.state.url === 'undefined') {
            return null;
        }

        return (
            <App
                config={ config }
                store={ store }
                url={ this.state.url }/>
        );
    }
}

// Register the root component.
AppRegistry.registerComponent('App', () => Root);
