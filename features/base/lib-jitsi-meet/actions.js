import JitsiMeetJS from './';
import {
    LIB_DISPOSED,
    LIB_INIT_ERROR,
    LIB_INITIALIZED
} from './actionTypes';
import './middleware';
import './reducer';

/**
 * Disposes lib-jitsi-meet.
 *
 * @returns {Function}
 */
export function disposeLib() {
    // XXX We're wrapping this to be able to "dispatch" the action, because we
    // will need to dispatch some errors to global error handler at some point.
    // TODO Currently, lib-jitsi-meet doesn't have any functionality to
    // dispose itself.
    return dispatch => dispatch({ type: LIB_DISPOSED });
}

/**
 * Initializes lib-jitsi-meet with passed configuration.
 *
 * @param {Object} [config={}] - Config object accepted by JitsiMeetJS#init()
 * method.
 * @returns {Function}
 */
// FIXME This is temporary solution until we figure out how to deal with
// analytics (and callstats) scripts async loading in React-Native environment.
// Also this is done here and not in config.js because currently we don't have
// access to config from where initLib() is currently called. This will be
// changed in scope of another PR.
// eslint-disable-next-line require-jsdoc
export function initLib(config = { disableThirdPartyRequests: true }) {
    // XXX We wrapping this to be able to "dispatch" the action, because
    // we will need to dispatch some errors to global error handler at some
    // point.
    return dispatch =>
        JitsiMeetJS.init(config)
            .then(() => dispatch({ type: LIB_INITIALIZED }))
            .catch(error => {
                dispatch({
                    type: LIB_INIT_ERROR,
                    lib: { error }
                });

                // TODO Handle LIB_INIT_ERROR error somewhere instead.
                console.error('lib-jitsi-meet failed to init due to ', error);
                throw error;
            });
}
