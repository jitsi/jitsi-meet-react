import {
    disposeLib,
    initLib
} from '../base/lib-jitsi-meet';
import {
    localParticipantJoined,
    localParticipantLeft
} from '../base/participants';
import {
    createLocalTracks,
    destroyLocalTracks
} from '../base/tracks';

import { APP_NAVIGATE } from './actionTypes';
import './middleware';

/**
 * Trigger an in-app navigation to a different screen. Allows navigation to be
 * abstracted between the mobile and web versions.
 *
 * @param {Object} opts - Navigation options.
 * @param {Navigator} opts.navigator - Navigator instance.
 * @param {string} opts.room - Conference room name.
 * @param {APP_SCREEN} opts.screen - Name of route/screen to switch to.
 * @returns {{
 *      type: APP_NAVIGATE,
 *      navigator: Navigator,
 *      room: string,
 *      screen: APP_SCREEN
 * }}
 */
export function navigate(opts) {
    return {
        type: APP_NAVIGATE,
        navigator: opts.navigator,
        room: opts.room,
        screen: opts.screen
    };
}

/**
 * Starts the application. Inits lib-jitsi-meet, creates local participant,
 * creates local media tracks.
 *
 * @param {Object} config - App configuration.
 * @returns {Function}
 */
export function start(config) {
    return dispatch => {
        return dispatch(initLib(config))
            .then(() => {
                dispatch(localParticipantJoined());
                return dispatch(createLocalTracks());
            });
    };
}

/**
 * Stops the application.
 *
 * @returns {Function}
 */
export function stop() {
    return dispatch => {
        dispatch(localParticipantLeft());
        return dispatch(destroyLocalTracks())
            .then(() => dispatch(disposeLib()));
    };
}