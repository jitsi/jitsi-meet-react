import JitsiMeetJS from './';

/**
 * Disposes lib-jitsi-meet.
 *
 * @returns {Function}
 */
export function disposeLib() {
    // XXX We wrapping this to be able to "dispatch" the action, because
    // we will need to dispatch some errors to global error handler at some
    // point.
    return dispatch => { // eslint-disable-line no-unused-vars
        // TODO: currently lib-jitsi-meet doesn't have any functionality to
        // dispose itself, so just return resolved Promise for now.
        return Promise.resolve();
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
    return dispatch => { // eslint-disable-line no-unused-vars
        return JitsiMeetJS.init(config)
            .catch(err => {
                // TODO: call global error handler here.
                console.error('lib-jitsi-meet failed to init due to ', err);
                throw err;
            });
    };
}


