import { combineReducers } from 'redux';

import user from './reducers/user';
import participants from './reducers/participants';


export * from './actions';

export const reducer = combineReducers({
    user,
    participants
});

