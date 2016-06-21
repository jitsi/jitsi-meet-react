import React, { Component } from 'react';
import { NavigatorIOS, AppRegistry } from 'react-native';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';

import Config from './config';

import reducers from './features/reducers';
// FIXME Don't import private styles. Move common/shared styles to a feature in
// base.
import styles from './features/welcome/components/native/styles/Styles';

import * as Actions from './features/actions';
import { WelcomePage } from './features/welcome';
import { Conference } from './features/conference';


const router = store => next => action => {
    console.log(action.type);
    if (action.type === 'APP_NAVIGATE') {
        switch (action.screen) {
            case 'home':
                return action.navigator.push({
                    title: 'Jitsi Meet',
                    component: WelcomePage
                });
            case 'conference':
                action.navigator.push({
                    title: action.roomName,
                    component: Conference
                });
                store.dispatch(Actions.init(Config, action.roomName));
                return;
        }
    }
    return next(action);
};


const reducer = combineReducers(reducers);
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
