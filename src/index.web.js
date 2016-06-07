import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import * as reducers from './reducers';

import Hello from './components/browser/Hello';


const reducer = combineReducers(reducers);
const store = createStore(reducer);


ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Hello} />
    </Router>
  </Provider>
), document.getElementById('app'));
