import { ReducerRegistry } from '../redux';

import { PARTICIPANT_REMOVED } from '../participants';

import {
    JITSI_CLIENT_DISCONNECTED,
    JITSI_CONFERENCE_LEFT
} from '../../welcome';

import { TRACK_ADDED, TRACK_REMOVED } from './actionTypes';

/**
 * Listen for actions that add or remove remote tracks.
 */
ReducerRegistry.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
    /**
     * Remove all tracks when connection is disconnected.
     */
    case JITSI_CLIENT_DISCONNECTED:
        return [];

    /**
     * Remove remote tracks when conference is left.
     */
    case JITSI_CONFERENCE_LEFT:
        return state.filter(track => track.isLocal());

    /**
     * Remove participant's tracks when participant is removed.
     */
    case PARTICIPANT_REMOVED:
        return state.filter(track => action.participant.local
            ? !track.isLocal()
            : track.isLocal() || (!track.isLocal() &&
                track.getParticipantId() !== action.participant.id));

    case TRACK_ADDED:
        return [...state, action.track];

    case TRACK_REMOVED:
        return state.filter(track => track !== action.track);

    default:
        return state;
    }
});
