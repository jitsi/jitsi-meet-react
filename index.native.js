import React, { Component } from 'react';
import { NavigatorIOS, AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import Thunk from 'redux-thunk';

import Config from './config';
import { APP_NAVIGATE } from './features/base/navigation';
import { Conference } from './features/conference';
// FIXME Don't import private styles. Move common/shared styles to a feature in
// base.
import { WelcomePage, styles, init } from './features/welcome';
import Reducers from './ReducerRegistry';

/**
 * This router middleware is used to abstract navigation
 * inside the app for both native and web.
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


const reducer = Reducers.getReducer();
const store = createStore(reducer, applyMiddleware(Thunk, router));

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <NavigatorIOS
                    style={styles.navContainer}
                    initialRoute={{
                        title: "Jitsi Meet",
                        component: WelcomePage
                    }}
                />
          </Provider>
        );
    }
}

AppRegistry.registerComponent('JitsiMeetApp', () => Root);
