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


import Config from './config';

const Jitsi = require('./src/jitsi');
import Conference from './src/components/Conference';


const reducer = combineReducers({
    jitsi: Jitsi.reducer 
});

const store = createStore(reducer, applyMiddleware(Thunk));

class Root extends Component {
    render() {
        return (
          <Provider store={store}>
            <Conference />
          </Provider>
        );
    }
}

store.dispatch(Jitsi.init(Config, 'lancetest'));

AppRegistry.registerComponent('JitsiMeetApp', () => Root);
