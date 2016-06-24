import jQuery from 'jquery';
jQuery(window);
window.$ = jQuery;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import {
    syncHistoryWithStore,
    routerReducer,
    routerMiddleware,
    push
} from 'react-router-redux';
import {
    createStore,
    applyMiddleware,
    combineReducers
} from 'redux';
import Thunk from 'redux-thunk';

import Config from './config';
import * as Actions from './features/actions';
import {Conference} from './features/conference';
import {APP_NAVIGATE} from './features/constants';
import reducers from './features/reducers';
import {WelcomePage} from './features/welcome';


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

const store = createStore(reducer, applyMiddleware(
    Thunk,
    router,
    routerMiddleware(browserHistory)
));

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render((
    <Provider store={ store }>
        <Router history={ history }>
            <Route path='/' component={ WelcomePage }/>
            <Route
                path='*'
                component={ Conference }
                onEnter={ route => {
                    const room =
                        route.location.pathname.substr(1).toLowerCase();
                    store.dispatch(Actions.init(Config, room));
                }}/>
        </Router>
    </Provider>
), document.body);

