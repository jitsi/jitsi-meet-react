import jQuery from 'jquery';
jQuery(window);
window.$ = jQuery;
import Strophe from 'strophe';


import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';
import { Provider } from 'react-redux';
import Thunk from 'redux-thunk';


import Config from './config';
import reducers from './features/reducers';
import * as Actions from './features/actions';
import { WelcomePage } from './features/welcome';
import { Conference } from './features/conference';

import { APP_NAVIGATE } from './features/constants';


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

const store = createStore(reducer, applyMiddleware(
    Thunk,
    router,
    routerMiddleware(browserHistory)
));

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={WelcomePage} />
      <Route path='*' component={Conference} onEnter={route => {
          store.dispatch(Actions.init(Config, route.location.pathname.substr(1).toLowerCase()));
      }} />
    </Router>
  </Provider>
), document.body);

