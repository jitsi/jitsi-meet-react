import React from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { RouteRegistry } from '../../base/navigation';
import { Conference } from '../../conference';
import { WelcomePage } from '../../welcome';

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

        // Bind event handlers so they are only bound once for every instance.
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let routes = RouteRegistry.getRoutes();
        let store = this.props.store;
        let roomName = store.getState()['features/base/conference'].roomName;

        // XXX It's important to select initialRoute from obtained routes
        // array and not from RouteRegistry#getRouteByComponent() method,
        // because React Native's Navigator will compare value in 'initialRoute'
        // prop with values in 'initialRouteStack' prop using simple comparison
        // operator.
        // We select initial route based on if we already have a room name or
        // not.
        let initialRoute = routes.find(
            r => r.component === (roomName !== '' ? Conference : WelcomePage));

        return (
            <Provider store={ store }>
                <Navigator
                    initialRoute={ initialRoute }
                    renderScene={ this._navigatorRenderScene }/>
            </Provider>
        );
    }

    /**
     * Tries to get conference room name from URL.
     * Alongside with getting room name from URL we want to compare hostname
     * from URL with domain name from config to ensure we're a going to join
     * room on the same domain for which our app is configured. This doesn't
     * work quite well with web version, e.g. we're running our web app on
     * localhost, but are joining meet.jit.si.
     *
     * @param {(string|undefined)} url - URL passed to the app.
     * @param {Object} config - Configuration object.
     * @override
     * @protected
     * @returns {string}
     */
    _getRoomNameFromUrl(url, config) {
        let urlObj = super._urlStringToObject(url, config);

        return urlObj.hostname === config.connection.hosts.domain
            ? super._getRoomNameFromUrlObject(urlObj)
            : '';
    }

    /**
     * Renders the scene identified by a specific route in a specific Navigator.
     *
     * @param {Object} route - The route which identifies the scene to be
     * rendered in the specified navigator. In the fashion of NavigatorIOS, the
     * specified route is expected to define a value for its component property
     * which is the type of React component to be rendered.
     * @param {Navigator} navigator - The Navigator in which the scene
     * identified by the specified route is to be rendered.
     * @private
     * @returns {ReactElement}
     */
    _navigatorRenderScene(route, navigator) {
        // We started with NavigatorIOS and then switched to Navigator in order
        // to support Android as well. In order to reduce the number of
        // modifications, accept the same format of route definition.
        return React.createElement(route.component, { navigator });
    }
}

/**
 * App component's property types.
 *
 * @static
 */
App.propTypes = AbstractApp.propTypes;