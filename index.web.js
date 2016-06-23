import jQuery from 'jquery';
jQuery(window);
window.$ = jQuery;
import Strophe from 'strophe';


import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';
import {
    syncHistoryWithStore,
    routerReducer,
    routerMiddleware,
    push
} from 'react-router-redux';


import Config from './config';
import reducers from './features/reducers';
import * as Actions from './features/actions';
import { WelcomePage } from './features/welcome';
import { Conference } from './features/conference';

import { APP_NAVIGATE } from './features/constants';

/**
 * This router middleware is used to abstract navigation
 * inside the app for both native and web.
 */
const router = store => next => action => {
    if (action.type === APP_NAVIGATE) {
        switch (action.screen) {
            case 'home':
                return store.dispatch(push('/'));
            case 'conference':
                return store.dispatch(push('/' + action.room));
        }
    }
    return next(action);
};


const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});

const store = createStore(reducer, compose(
    applyMiddleware(
        Thunk,
        router,
        routerMiddleware(browserHistory)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={WelcomePage} />
      <Route path='*' component={Conference} onEnter={route => {
          const room = route.location.pathname.substr(1).toLowerCase();
          store.dispatch(Actions.init(Config, room));
      }} />
    </Router>
  </Provider>
), document.body);

