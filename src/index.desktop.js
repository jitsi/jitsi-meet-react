import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import * as reducers from './reducers';

import Hello from './components/browser/Hello';


const reducer = combineReducers(reducers);
const store = createStore(reducer);


ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={Hello} />
    </Router>
  </Provider>
), document.getElementById('app'));
