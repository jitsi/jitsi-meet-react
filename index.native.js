import React, { Component } from 'react';
import { NavigatorIOS, AppRegistry } from 'react-native';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';

import Config from './config';

import reducer from './features/reducers';
import styles from './features/welcome/components/native/styles/WelcomePageStyle';

import WelcomePage from './features/welcome/components/WelcomePage';


const store = createStore(reducer, applyMiddleware(Thunk));

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
