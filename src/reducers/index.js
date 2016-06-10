import user from './user';
import participants from './participants';
import client from './client';
import localTracks from './localTracks';
import remoteTracks from './remoteTracks';
import media from './media';


const subReducers = {
    client,
    user,
    participants,
    localTracks,
    remoteTracks,
    media
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
