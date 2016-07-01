import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { Conference } from '../../../conference';
import { init, WelcomePage } from '../../../welcome';

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

        // Create an enhanced history that syncs navigation events with the
        // store.
        // @see https://github.com/reactjs/react-router-redux#how-it-works
        this.history = syncHistoryWithStore(browserHistory, props.store);

        // Bind event handlers so they are only bound once for every instance.
        this._onConferenceRouteEnter = this._onConferenceRouteEnter.bind(this);
    }

    /**
     * React component render method.
     *
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <Provider store={this.props.store}>
                <Router history={this.history}>
                    <Route
                        path='/'
                        component={WelcomePage}/>
                    <Route
                        path='*'
                        component={Conference}
                        onEnter={this._onConferenceRouteEnter}/>
                </Router>
            </Provider>
        );
    }

    /**
     * Init JitsiMeetJS and new conference when we enter the "conference" route.
     *
     * @param {Object} route - Current route.
     * @private
     * @returns {void}
     */
    _onConferenceRouteEnter(route) {
        const room = route.location.pathname.substr(1).toLowerCase();
        this.props.store.dispatch(init(this.props.config, room));
    }
}

App.propTypes = {
    store: React.PropTypes.object,
    config: React.PropTypes.object
};
