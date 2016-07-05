import config from '../../config';
import JitsiMeetJS from '../base/lib-jitsi-meet';

import {
    localParticipantJoined,
    removeLocalParticipant
} from '../base/participants';

import {
    createLocalTracks,
    DEVICE_TYPE,
    removeLocalTracks,
    setLocalTracks
} from '../base/tracks';

import { create } from '../conference';

import {
    CONNECTION_DISCONNECTED,
    CONNECTION_ERROR,
    CONNECTION_ESTABLISHED
} from './actionTypes';

import { openConnection } from './connection';

import './reducer';

/**
 * Creates local media tracks. Will show error dialogs in case if accessing
 * local microphone and/or camera failed. Will show guidance overlay for users
 * on how to give access to camera and/or microphone.
 *
 * @private
 * @returns {Promise<JitsiLocalTrack[]>}
 */
function createInitialLocalTracks() {
    let audioAndVideoError,
        audioOnlyError;

    // TODO: show guidance overlay when UI is available
    // JitsiMeetJS.mediaDevices.addEventListener(
    //     JitsiMeetJS.events.mediaDevices.PERMISSION_PROMPT_IS_SHOWN,
    //     browser => APP.UI.showUserMediaPermissionsGuidanceOverlay(browser));

    // First try to retrieve both audio and video.
    return createLocalTracks({
        devices: [ DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO ]
    }, true)
    .catch(err => {
        // If failed then try to retrieve only audio.
        audioAndVideoError = err;
        return createLocalTracks({ devices: [ DEVICE_TYPE.AUDIO ] }, true);
    })
    .catch(err => {
        // If audio failed too then just return empty array for tracks.
        audioOnlyError = err;
        return [];
    })
    .then(tracks => {
        // TODO: hide overlay when UI is available
        //APP.UI.hideUserMediaPermissionsGuidanceOverlay();

        if (audioAndVideoError) {
            if (audioOnlyError) {
                // If both requests for 'audio' + 'video' and 'audio' only
                // failed, we assume that there is some problems with user's
                // microphone and show corresponding dialog.
                // TODO: show dialog instead of console.error
                //APP.UI.showDeviceErrorDialog(audioOnlyError, null);
                console.error('Microphone gUM error', audioOnlyError);
            } else {
                // If request for 'audio' + 'video' failed, but request for
                // 'audio' only was OK, we assume that we had problems with
                // camera and show corresponding dialog.
                // TODO: show dialog instead of console.error
                //APP.UI.showDeviceErrorDialog(null, audioAndVideoError);
                console.error('Camera gUM error', audioOnlyError);
            }
        }

        return tracks;
    });
}

/**
 * Open Connection. When authentication failed it shows auth dialog.
 *
 * @private
 * @param {string} roomName - The room name to use.
 * @returns {Promise<JitsiConnection>}
 */
function connect(roomName) {
    return openConnection({retry: true, roomName: roomName})
        .catch(function (err) {
            // TODO: implement when UI is available instead of console.log
            console.error(err);

            // if (err === JitsiConnectionErrors.PASSWORD_REQUIRED) {
            //     APP.UI.notifyTokenAuthFailed();
            // } else {
            //     APP.UI.notifyConnectionFailed(err);
            // }

            throw err;
        });
}

/**
 * Sets up global error handlers.
 *
 * @private
 * @returns {void}
 */
function setupGlobalErrorHandler() {
    let oldOnErrorHandler = window.onerror;
    let oldOnUnhandledRejection = window.onunhandledrejection;

    window.onerror = function (message, source, lineno, colno, error) {
        JitsiMeetJS.getGlobalOnErrorHandler(
            message, source, lineno, colno, error);

        if (oldOnErrorHandler) {
            oldOnErrorHandler(message, source, lineno, colno, error);
        }
    };

    window.onunhandledrejection = function(event) {
        JitsiMeetJS.getGlobalOnErrorHandler(
            null, null, null, null, event.reason);

        if (oldOnUnhandledRejection) {
            oldOnUnhandledRejection(event);
        }
    };
}

/**
 * Create an action for when the signaling connection has been lost.
 *
 * @param {string} [message] - Error message.
 * @returns {{type: CONNECTION_DISCONNECTED, message: string}}
 */
function connectionDisconnected(message) {
    return {
        type: CONNECTION_DISCONNECTED,
        message
    };
}

/**
 * Create an action for when the signaling connection could not be created.
 *
 * @param {string} error - Error message.
 * @returns {{type: CONNECTION_ERROR, error: string}}
 */
function connectionFailed(error) {
    return {
        type: CONNECTION_ERROR,
        error
    };
}

/**
 * Create an action for when the signaling connection has been established.
 *
 * @param {JitsiConnection} connection - JitsiConnection instance.
 * @returns {{type: CONNECTION_ESTABLISHED, connection: JitsiConnection}}
 */
function connectionEstablished(connection) {
    return {
        type: CONNECTION_ESTABLISHED,
        connection
    };
}

/**
 * Initialize the JitsiMeetJS library, start local media, and then join
 * the named conference.
 *
 * @param {Object} config - Configuration object.
 * @param {string} room - Conference room name.
 * @returns {Function}
 */
export function init(config, room) {
    return (dispatch, getState)  => {
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.TRACE);

        // Attaches global error handler, if there is already one, respect it.
        if (JitsiMeetJS.getGlobalOnErrorHandler) {
            setupGlobalErrorHandler();
        }

        return JitsiMeetJS.init(config)
            .then(() => {
                let localTracksPromise = createInitialLocalTracks();
                let connectionPromise = connect(room)
                    .catch(err => {
                        dispatch(connectionFailed(err));
                        throw err;
                    });

                return Promise.all([ localTracksPromise, connectionPromise ]);
            })
            .then(([tracks, connection]) => {
                dispatch(setLocalTracks(tracks));
                dispatch(connectionEstablished(connection));
                dispatch(create(room));

                let conference = getState()['features/conference'];

                dispatch(localParticipantJoined(conference.myUserId()));

                // TODO: dispatch an action if desktop sharing is enabled or not
                // this.isDesktopSharingEnabled =
                //     JitsiMeetJS.isDesktopSharingEnabled();

                // If user didn't give access to mic or camera or doesn't have
                // them at all, we disable corresponding toolbar buttons.
                if (!tracks.find((t) => t.isAudioTrack())) {
                    // TODO: dispatch an action to disable microphone icon
                    //APP.UI.disableMicrophoneButton();
                }

                if (!tracks.find((t) => t.isVideoTrack())) {
                    // TODO: dispatch an action to disable camera icon
                    //APP.UI.disableCameraButton();
                }

                if (config.iAmRecorder) {
                    // TODO: init recorder
                    //this.recorder = new Recorder();
                }
            });
    };
}

/**
 * Disconnect from connection.
 *
 * @returns {Function}
 */
export function disconnect() {
    return (dispatch, getState) => {
        const connection = getState()['features/connection'];

        if (connection) {
            connection.disconnect();

            dispatch(removeLocalParticipant());
            dispatch(removeLocalTracks());
            dispatch(connectionDisconnected());
        }
    };
}