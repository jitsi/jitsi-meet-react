import React from 'react';
import { Linking, Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { roomSet } from '../../base/conference';
import { navigate, RouteRegistry } from '../../base/navigator';
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
        this._handleOpenURL = this._handleOpenURL.bind(this);
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this);
    }

    /**
     * Subscribe to an event whenever "linked" to app url is activated.
     *
     * @inheritdoc
     * @see https://facebook.github.io/react-native/docs/linking.html
     * @returns {void}
     */
    componentDidMount() {
        Linking.addEventListener('url', this._handleOpenURL);
    }

    /**
     * Unsubscribe from an event whenever "linked" to app url is activated.
     *
     * @inheritdoc
     * @see https://facebook.github.io/react-native/docs/linking.html
     * @returns {void}
     */
    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let store = this.props.store;
        let room = store.getState()['features/base/conference'].room;
        let initialComponent = room ? Conference : WelcomePage;
        // XXX It's important to select initialRoute from obtained routes
        // array and not from RouteRegistry#getRouteByComponent() method,
        // because React Native's Navigator will compare value in 'initialRoute'
        // prop with values in 'initialRouteStack' prop using simple comparison
        // operator.
        let initialRoute =
            RouteRegistry.getRoutes().find(
                r => r.component === initialComponent);

        return (
            <Provider store={ store }>
                <Navigator
                    initialRoute={ initialRoute }
                    ref='navigator'
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
     * @override
     * @protected
     * @returns {string}
     */
    _getRoomFromUrlString(url) {
        let urlObj = super._urlStringToObject(url);
        let room;

        if (urlObj
                && (urlObj.hostname
                    === this.props.config.connection.hosts.domain)) {
            room = super._getRoomFromUrlObject(urlObj);
        }
        return room;
    }

    /**
     * Handler for a case when new "linked" url is activated. Parses room name
     * from url and starts a new conference with this room name if it's not
     * empty and is different from current one.
     *
     * @param {Object} event - Event.
     * @param {string} event.url - New URL.
     * @private
     * @returns {void}
     */
    _handleOpenURL(event) {
        let newRoom = this._getRoomFromUrlString(event.url);

        if (newRoom !== '') {
            let store = this.props.store;
            let oldRoom = store.getState()['features/base/conference'].room;

            if (oldRoom !== newRoom) {
                let dispatch = store.dispatch;

                // TODO We should probably detect if user is currently in a
                // conference and ask her if she wants to close the current
                // conference and start a new one with the new room name.
                dispatch(roomSet(newRoom));
                dispatch(navigate({
                    component: Conference,
                    navigator: this.refs.navigator,
                    room: newRoom
                }));
            }
        }
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
        return this._createElement(route.component, { navigator });
    }
}

/**
 * App component's property types.
 *
 * @static
 */
App.propTypes = AbstractApp.propTypes;
