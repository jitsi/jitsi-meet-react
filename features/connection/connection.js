import config from '../../config';
import JitsiMeetJS from '../base/lib-jitsi-meet';

const ConnectionEvents = JitsiMeetJS.events.connection;
const ConnectionErrors = JitsiMeetJS.errors.connection;

// TODO: currently external connect feature is not available
/**
 * Checks if we have data to use attach instead of connect. If we have the data
 * executes attach otherwise check if we have to wait for the data. If we have
 * to wait for the attach data we are setting handler to APP.connect.handler
 * which is going to be called when the attach data is received otherwise
 * executes connect.
 *
 * @param {string} [id] - User id.
 * @param {string} [password] - Password.
 * @param {JitsiConnection} [connection] - Connection instance.
 */
/*
function checkForAttachParametersAndConnect(id, password, connection) {
    if(window.XMPPAttachInfo){
        APP.connect.status = "connecting";
        // When connection optimization is not deployed or enabled the default
        // value will be window.XMPPAttachInfo.status = "error"
        // If the connection optimization is deployed and enabled and there is
        // a failure the value will be window.XMPPAttachInfo.status = "error"
        if(window.XMPPAttachInfo.status === "error") {
            connection.connect({id, password});
            return;
        }

        var attachOptions = window.XMPPAttachInfo.data;
        if(attachOptions) {
            connection.attach(attachOptions);
            delete window.XMPPAttachInfo.data;
        } else {
            connection.connect({id, password});
        }
    } else {
        APP.connect.status = "ready";
        APP.connect.handler = checkForAttachParametersAndConnect.bind(null,
            id, password, connection);
    }
}
*/

/**
 * Try to open connection using provided credentials.
 *
 * @param {string} [id] - User id.
 * @param {string} [password] - Password.
 * @param {string} [roomName] - The name of the conference.
 * @returns {Promise<JitsiConnection>} - Connection if everything is ok,
 *      otherwise error.
 */
function connect(id, password, roomName) {
    let connectionConfig = Object.assign({}, config);
    connectionConfig.bosh += '?room=' + roomName;

    let connection
        = new JitsiMeetJS.JitsiConnection(null, config.token, connectionConfig);

    return new Promise(function (resolve, reject) {
        connection.addEventListener(
            ConnectionEvents.CONNECTION_ESTABLISHED, handleConnectionEstablished
        );
        connection.addEventListener(
            ConnectionEvents.CONNECTION_FAILED, handleConnectionFailed
        );

        /**
         * Unsubscribes connection instance from events.
         *
         * @returns {void}
         */
        function unsubscribe() {
            connection.removeEventListener(
                ConnectionEvents.CONNECTION_ESTABLISHED,
                handleConnectionEstablished
            );
            connection.removeEventListener(
                ConnectionEvents.CONNECTION_FAILED,
                handleConnectionFailed
            );
        }

        /**
         * Resolves external promise when connection is established.
         *
         * @returns {void}
         */
        function handleConnectionEstablished() {
            unsubscribe();
            resolve(connection);
        }

        /**
         * Rejectes external promise when connection fails.
         *
         * @param {ConnectionErrors} err - Connection error.
         * @returns {void}
         */
        function handleConnectionFailed(err) {
            unsubscribe();
            console.error('CONNECTION FAILED:', err);
            reject(err);
        }

        // TODO: currently external connect feature is not available
        //checkForAttachParametersAndConnect(id, password, connection);

        connection.connect();
    });
}

/**
 * Show Authentication Dialog and try to connect with new credentials.
 * If failed to connect because of PASSWORD_REQUIRED error then ask for password
 * again.
 *
 * @param {string} [roomName] - Name of conference room.
 * @returns {Promise<JitsiConnection>}
 */
function requestAuth(roomName) {
    return new Promise(function (resolve) {
        // TODO: fix when UI is available
        console.log('Will show login dialog for room ', roomName);
        resolve();
        // let authDialog = LoginDialog.showAuthDialog(
        //     function (id, password) {
        //         connect(id, password, roomName).then(function (connection) {
        //             authDialog.close();
        //             resolve(connection);
        //         }, function (err) {
        //             if (err === ConnectionErrors.PASSWORD_REQUIRED) {
        //                 authDialog.displayError(err);
        //             } else {
        //                 authDialog.close();
        //                 reject(err);
        //             }
        //         });
        //     }
        // );
    });
}

/**
 * Open JitsiConnection using provided credentials.
 * If retry option is true it will show auth dialog on PASSWORD_REQUIRED error.
 *
 * @param {Object} [options={}] - Options.
 * @param {string} [options.id] - User id.
 * @param {string} [options.password] - Password.
 * @param {string} [options.roomName] - Conference room name.
 * @param {boolean} [options.retry] - If we should show auth dialog
 *      on PASSWORD_REQUIRED error.
 * @returns {Promise<JitsiConnection>}
 */
export function openConnection(options) {
    options || (options = {});

    let { id, password, retry, roomName } = options;
    let usernameOverride;
    // TODO: React-Native doesn't support local storage. Need polyfill.
        //= window.localStorage.getItem('xmpp_username_override');
    let passwordOverride;
        //= window.localStorage.getItem('xmpp_password_override');

    if (usernameOverride && usernameOverride.length > 0) {
        id = usernameOverride;
    }

    if (passwordOverride && passwordOverride.length > 0) {
        password = passwordOverride;
    }

    return connect(id, password, roomName).catch(function (err) {
        if (!retry) {
            throw err;
        }

        if (err === ConnectionErrors.PASSWORD_REQUIRED) {
            // do not retry if token is not valid
            if (config.token) {
                throw err;
            } else {
                return requestAuth(roomName);
            }
        } else {
            throw err;
        }
    });
}
