import React, { Component } from 'react';
import { AppRegistry } from 'react-native';


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

import WebRTC from 'react-native-webrtc';


import Config from './config/development';

const Jitsi = require('./src/jitsi');

import ReduxState from './src/app-bootstrap/ReduxState.native';


const reducer = combineReducers({
    jitsi: Jitsi.reducer 
});

const store = createStore(reducer, applyMiddleware(
    Thunk.withExtraArgument(function getJitsiClient(store) {
        return store.getState().jitsi.client;
    })
));


class Root extends Component {
    render() {
        return (
          <Provider store={store}>
            <ReduxState />
          </Provider>
        );
    }
}


AppRegistry.registerComponent('JitsiMeetApp', () => Root);


// Temp bootstrapping
store.dispatch(Jitsi.init(Config, 'fooo'));

