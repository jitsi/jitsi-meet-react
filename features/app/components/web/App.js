import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
    browserHistory,
    Route,
    Router
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import {
    destroy,
    init
} from '../../../base/connection';
import { Conference } from '../../../conference';
import { WelcomePage } from '../../../welcome';

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

        // Bind event handlers so they are only bound once for every instance.
        this._onConferenceRouteEnter = this._onConferenceRouteEnter.bind(this);
        this._onConferenceRouteLeave = this._onConferenceRouteLeave.bind(this);
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
                <Router history={this.history}>
                    <Route
                        path='/'
                        component={WelcomePage}/>
                    <Route
                        path='*'
                        component={Conference}
                        onEnter={this._onConferenceRouteEnter}
                        onLeave={this._onConferenceRouteLeave}/>
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

    /**
     * Destroy connection, conference and local tracks when we leave the
     * "conference" route.
     *
     * @private
     * @returns {void}
     */
    _onConferenceRouteLeave() {
        this.props.store.dispatch(destroy());
    }
}

App.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object
};
