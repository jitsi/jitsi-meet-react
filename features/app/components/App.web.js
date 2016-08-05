import React from 'react';
import { Provider } from 'react-redux';
import {
    browserHistory,
    Route,
    Router
} from 'react-router';
import { push, syncHistoryWithStore } from 'react-router-redux';

import { RouteRegistry } from '../../base/navigator';

import { AbstractApp } from './AbstractApp';

/**
 * Root application component.
 *
 * @extends AbstractApp
 */
export class App extends AbstractApp {
    /**
     * Initializes a new App instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);

        /**
         * Create an enhanced history that syncs navigation events with the
         * store.
         * @link https://github.com/reactjs/react-router-redux#how-it-works
         */
        this.history = syncHistoryWithStore(browserHistory, props.store);

        // Bind event handlers so they are only bound once for every instance.
        this._onRouteEnter = this._onRouteEnter.bind(this);
        this._routerCreateElement = this._routerCreateElement.bind(this);
    }

    /**
     * Navigates to a specific Route (via platform-specific means).
     *
     * @override
     * @param {Route} route - The Route to which to navigate.
     * @returns {void}
     */
    navigate(route) {
        let path = route.path;
        let store = this.props.store;

        // The syntax :room bellow is defined by react-router. It "matches a URL
        // segment up to the next /, ?, or #. The matched string is called a
        // param."
        path =
            path.replace(
                /:room/g,
                store.getState()['features/base/conference'].room);

        return store.dispatch(push(path));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let routes = RouteRegistry.getRoutes();

        return (
            <Provider store={ this.props.store }>
                <Router
                    createElement={ this._routerCreateElement }
                    history={ this.history }>
                {
                    routes.map(r => (
                        <Route
                            component={ r.component }
                            key={ r.component }
                            onEnter={ this._onRouteEnter }
                            path={ r.path } />
                    ))
                }
                </Router>
            </Provider>
        );
    }

    /**
     * Invoked by react-router to notify this App that a Route is about to be
     * rendered.
     *
     * @private
     * @returns {void}
     */
    _onRouteEnter() {
        // Our Router configuration (at the time of this writing) is such that
        // each Route corresponds to a single URL. Hence, entering into a Route
        // is like opening a URL.
        this._openURL(window.location.toString());
    }

    /**
     * Create a ReactElement from the specified component and props on behalf of
     * the associated Router.
     *
     * @param {Component} component - The component from which the ReactElement
     * is to be created.
     * @param {Object} props - The read-only React Component props with which
     * the ReactElement is to be initialized.
     * @private
     * @returns {ReactElement}
     */
    _routerCreateElement(component, props) {
        return this._createElement(component, props);
    }
}

/**
 * App component's property types.
 *
 * @static
 */
App.propTypes = AbstractApp.propTypes;
