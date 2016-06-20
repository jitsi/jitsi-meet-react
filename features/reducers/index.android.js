require('../polyfills');

import user from './user';
import participants from './participants';
import localTracks from './localTracks';
import remoteTracks from './remoteTracks';

const subReducers = {
    user,
    localTracks,
    remoteTracks
};

export default function reducer(state = {}, action) {
    let newState = {};

    Object.keys(subReducers).forEach(key => {
        if (subReducers.hasOwnProperty(key)) {
            newState[key] = subReducers[key](state[key], action);
        }
    });

    return newState;
}
