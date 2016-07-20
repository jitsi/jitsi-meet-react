import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { Conference } from '../../conference';
import { WelcomePage } from '../../welcome';

/**
 * Welcome mobile app screen.
 *
 * @type {{ component: Component, index: number}}
 */
const WelcomePageScreen = {
    component: WelcomePage,
    index: 0
};

/**
 * Conference mobile app screen.
 *
 * @type {{component: Component, index: number}}
 */
const ConferenceScreen = {
    component: Conference,
    index: 1
};

/**
 * Root application component.
 *
 * @extends Component
 */
export class App extends Component {
    /**
     * Initializes a new Root instance.
     *
     * @param {Object} props - The read-only properties with which the new
     *      instance is to be initialized.
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
        return (
            <Provider store={this.props.store}>
                <Navigator
                    initialRoute={WelcomePageScreen}
                    initialRouteStack={[ WelcomePageScreen, ConferenceScreen ]}
                    renderScene={this._navigatorRenderScene}/>
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
    store: React.PropTypes.object
};
