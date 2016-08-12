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
export function initLib(
        config = {
            // FIXME Lib-jitsi-meet uses HTML script elements to asynchronously
            // load certain pieces of JavaScript. Unfortunately, the technique
            // doesn't work on React Native (because there are no HTML elements
            // in the first place). Fortunately, these pieces of JavaScript
            // currently involve third parties and we can temporarily disable
            // them (until we implement an alternative to async script elements
            // on React Native).
            disableThirdPartyRequests: true
        }) {
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
