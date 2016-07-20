import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { ScreenRegistry } from '../../base/navigation';

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

        // XXX Unfortunately, React-Native Navigator doesn't allow to handle
        // 'onLeave' or 'onEnter' events for particular screen. Instead it has
        // global 'onDidFocus' and 'onWillFocus' events, but there we receive
        // only new screen as an argument and don't know the previous one.
        // So here we introduce this property to be able to have previous screen
        // when screen change occurs.
        this._activeScreen = null;

        // Bind event handlers so they are only bound once for every instance.
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this);
        this._navigatorScreenDidFocus =
            this._navigatorScreenDidFocus.bind(this);
        this._navigatorScreenWillFocus =
            this._navigatorScreenWillFocus.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let screens = ScreenRegistry.getAllScreens();

        return (
            <Provider store={this.props.store}>
                <Navigator
                    initialRoute={screens[0]}
                    initialRouteStack={screens}
                    onDidFocus={this._navigatorScreenDidFocus}
                    onWillFocus={this._navigatorScreenWillFocus}
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

    /**
     * Remember passed screen as active after it was focused.
     *
     * @param {Screen} screen - App screen that became active.
     * @private
     * @returns {void}
     */
    _navigatorScreenDidFocus(screen) {
        this._activeScreen = screen;
    }

    /**
     * Unfortunately, React-Native Navigator doesn't allow to handle
     * 'onLeave' or 'onEnter' events for particular screen. Instead it has
     * global 'onDidFocus' and 'onWillFocus' events and here we handle the
     * screen change to re-assemble logic of Router for web.
     *
     * @param {Screen} screen - New app screen to become active.
     * @private
     * @returns {void}
     */
    _navigatorScreenWillFocus(screen) {
        let store = this.props.store;

        if (this._activeScreen) {
            this._activeScreen.onLeave(store);
        }

        screen.onEnter(store);
    }
}

App.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object
};
