import { combineReducers } from 'redux';

import user from './reducers/user';
import participants from './reducers/participants';
import client from './reducers/client';
import localTracks from './reducers/localTracks';
import remoteTracks from './reducers/remoteTracks';

export * from './actions';

export const reducer = combineReducers({
    client,
    user,
    participants,
    localTracks,
    remoteTracks
});

