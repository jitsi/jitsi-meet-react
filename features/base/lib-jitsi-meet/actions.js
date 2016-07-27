import JitsiMeetJS from './';
import {
    LIB_DISPOSED,
    LIB_INIT_ERROR,
    LIB_INITIALIZED
} from './actionTypes';
import './reducer';

/**
 * Disposes lib-jitsi-meet.
 *
 * @returns {Function}
 */
export function disposeLib() {
    // XXX We wrapping this to be able to "dispatch" the action, because
    // we will need to dispatch some errors to global error handler at some
    // point.
    return dispatch => {
        // TODO: currently lib-jitsi-meet doesn't have any functionality to
        // dispose itself.
        return dispatch({ type: LIB_DISPOSED });
    };
}

/**
 * Initializes lib-jitsi-meet with passed configuration.
 *
 * @param {Object} [config={}] - Config object accepted by JitsiMeetJS#init()
 * method.
 * @returns {Function}
 */
export function initLib(config) {
    config || (config = {});

    // XXX We wrapping this to be able to "dispatch" the action, because
    // we will need to dispatch some errors to global error handler at some
    // point.
    return dispatch => {
        return JitsiMeetJS.init(config)
            .then(() => dispatch({ type: LIB_INITIALIZED }))
            .catch(error => {
                dispatch({
                    type: LIB_INIT_ERROR,
                    lib: { error }
                });
                // TODO: handle LIB_INIT_ERROR error somewhere instead
                console.error('lib-jitsi-meet failed to init due to ', error);
                throw error;
            });
    };
}


