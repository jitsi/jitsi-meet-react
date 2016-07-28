import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { RouteRegistry } from '../../base/navigation';
import { WelcomePage } from '../../welcome';

/**
 * Root application component.
 *
 * @extends Component
 */
export class App extends Component {
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
        // XXX It's important to select initialRoute from obtained routes
        // array and not from RouteRegistry#getRouteByComponent() method,
        // because React Native's Navigator will compare value in 'initialRoute'
        // prop with values in 'initialRouteStack' prop using simple comparison
        // operator.
        let initialRoute = routes.find(r => r.component === WelcomePage);

        return (
            <Provider store={ this.props.store }>
                <Navigator
                    initialRoute={ initialRoute }
                    renderScene={ this._navigatorRenderScene }/>
            </Provider>
        );
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

App.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object,
    /**
     * The URL, if any, with which the app was launched. Supported on Android
     * only at the time of this writing.
     */
    url: React.PropTypes.string
};
