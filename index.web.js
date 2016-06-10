import jQuery from 'jquery';
jQuery(window);
window.$ = jQuery;
import Strophe from 'strophe';


import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';


import Config from 'config';

import * as Jitsi from './src/jitsi';

import ReduxState from './src/media-bootstrap/ReduxState.browser';


const reducer = combineReducers({
    routing: routerReducer,
    jitsi: Jitsi.reducer 
});

const store = createStore(reducer, applyMiddleware(
    Thunk.withExtraArgument(function getJitsiClient(store) {
        return store.getState().jitsi.client;
    })
));

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={ReduxState}>
        <Route path='*' component={ReduxState} onEnter={(nextState) => {
            const room = nextState.location.pathname.substr(1);
            store.dispatch(Jitsi.init(Config, room));
        }} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('media'));


console.log(store.getState());
