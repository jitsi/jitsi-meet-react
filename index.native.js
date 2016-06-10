import React, { Component } from 'react';
import { NavigatorIOS, AppRegistry } from 'react-native';


const jQuery = require('jquery');
require('./src/polyfills/browser');
jQuery(window);
require('strophe');
require('strophejs-plugins/disco/strophe.disco');
require('strophejs-plugins/caps/strophe.caps.jsonly');
require('./src/polyfills/browserify');


import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';


import Config from './config';

import reducer from './src/reducers';
import styles from './src/components/native/styles/MainStyle';

import Conference from './src/components/Conference';
import WelcomePage from './src/components/WelcomePage';


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
