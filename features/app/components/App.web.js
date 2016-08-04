import React from 'react';
import { Provider } from 'react-redux';
import {
    browserHistory,
    Route,
    Router
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

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
        this._routerCreateElement = this._routerCreateElement.bind(this);
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
                            key={ r.component }
                            path={ r.path }
                            component={ r.component }/>
                    ))
                }
                </Router>
            </Provider>
        );
    }

    /**
     * Create a ReactElement from the specified component and props on behalf of
     * the associated Router.
     *
     * @param {Component} component - The component from which the ReactElement
     * is to be created.
     * @param {Object} props - The read-only React Component props with which
     * the ReactElement is to be initialized.
     * @returns {ReactElement}
     * @private
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
