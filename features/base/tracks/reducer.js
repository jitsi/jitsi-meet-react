import { CONFERENCE_LEFT } from '../conference';
import { CONNECTION_DISCONNECTED } from '../connection';
import { PARTICIPANT_LEFT } from '../participants';
import { ReducerRegistry } from '../redux';

import {
    TRACK_ADDED,
    TRACK_MUTE_CHANGED,
    TRACK_REMOVED
} from './actionTypes';

/**
 * Listen for actions that add or remove remote and local tracks.
 */
ReducerRegistry.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
    /**
     * Remove all tracks when connection is disconnected.
     */
    case CONNECTION_DISCONNECTED:
        return [];

    /**
     * Remove remote tracks when conference is left.
     */
    case CONFERENCE_LEFT:
        return state.filter(track => track.isLocal());

    /**
     * Remove participant's tracks when participant is left.
     */
    case PARTICIPANT_LEFT:
        return state.filter(track => action.participant.local
            ? !track.isLocal()
            : track.isLocal() || (!track.isLocal() &&
                track.getParticipantId() !== action.participant.id));

    case TRACK_ADDED:
        return [...state, action.track];
    
    case TRACK_MUTE_CHANGED:
        // XXX While the JitsiTrack is in the redux state, its mute state is
        // not. Consequently, the action TRACK_MUTE_CHANGED gets reduced to a
        // mere simulation of a state change.
        return [...state];
    
    case TRACK_REMOVED:
        return state.filter(track => track !== action.track);
    
    default:
        return state;
    }
});
