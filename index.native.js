import React, { Component } from 'react';
import { AppRegistry, Navigator } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import Thunk from 'redux-thunk';

import Config from './config';
import { APP_NAVIGATE } from './features/base/navigation';
import { ReducerRegistry } from './features/base/redux';
import { Conference } from './features/conference';
// FIXME Don't import private styles. Move common/shared styles to a feature in
// base.
import { init, styles, WelcomePage } from './features/welcome';

/**
 * This router middleware is used to abstract navigation inside the app for both
 * native and web.
 *
 * @param {Store} store - Redux store.
 * @returns {Object}
 */
const router = store => next => action => {
    if (action.type === APP_NAVIGATE) {
        switch (action.screen) {
        case 'home':
            return action.navigator.push({
                title: 'Jitsi Meet',
                component: WelcomePage
            });
        case 'conference':
            action.navigator.push({
                title: action.room,
                component: Conference
            });
            store.dispatch(init(Config, action.room));
            return;
        }
    }
    return next(action);
};

const reducer = ReducerRegistry.combineReducers();
const store = createStore(reducer, applyMiddleware(Thunk, router));

/**
 * App root component.
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

        // Bind event handlers so they are only bound once for every instance.
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this);
    }

    /**
     * Implements React Component's render method.
     *
     * @inheritdoc
     * @returns {XML} - JSX markup.
     */
    render() {
        return (
            <Provider store={store}>
                <Navigator
                    initialRoute={{
                        title: 'Jitsi Meet',
                        component: WelcomePage
                    }}
                    renderScene={this._navigatorRenderScene}
                    style={styles.navContainer}
                />
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

AppRegistry.registerComponent('JitsiMeetApp', () => Root);
