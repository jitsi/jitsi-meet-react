import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import * as reducers from './reducers';

import Hello from './components/native/Hello';


const reducer = combineReducers(reducers);
const store = createStore(reducer);


class App extends Component {
    render() {
        return (
          <Provider store={store}>
            <Hello />
          </Provider>
        );
    }
}


AppRegistry.registerComponent('JitsiMeetApp', () => App);
