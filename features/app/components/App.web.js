import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
    browserHistory,
    Route,
    Router
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { ScreenRegistry } from '../../base/navigation';

/**
 * Root application component.
 *
 * @extends Component
 */
export class App extends Component {
    /**
     * Constructs new App component.
     *
     * @param {Object} props - React component properties.
     */
    constructor(props) {
        super(props);

        /**
         * Create an enhanced history that syncs navigation events with the
         * store.
         * @link https://github.com/reactjs/react-router-redux#how-it-works
         */
        this.history = syncHistoryWithStore(browserHistory, props.store);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let store = this.props.store;
        let screens = ScreenRegistry.getAllScreens();

        return (
            <Provider store={this.props.store}>
                <Router history={this.history}>
                    { screens.map(screen => {
                        return (
                            <Route
                                key={screen.name}
                                path={screen.path}
                                component={screen.component}
                                onEnter={() => screen.onEnter(store)}
                                onLeave={() => screen.onLeave(store)}/>
                        );
                    })}
                </Router>
            </Provider>
        );
    }
}

App.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object
};
