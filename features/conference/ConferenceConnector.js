// TODO: this is temp solution until PR #36 is merged. Import after.
/* global store */

import JitsiMeetJS from '../base/lib-jitsi-meet';

import { leave } from './actions';
import { disconnect } from '../connection';

const ConferenceEvents = JitsiMeetJS.events.conference;
const ConferenceErrors = JitsiMeetJS.errors.conference;

/**
 * Conference connector.
 */
export default class ConferenceConnector {
    /**
     * Constructs new instance.
     */
    constructor() {
        /**
         * Internal promise to be resolved or rejected after
         * ConferenceConnector#connect() is called.
         *
         * @type {Promise}
         * @private
         */
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        /**
         * Private reference to conference instance.
         *
         * @type {JitsiConference}
         * @private
         */
        this._conference = store.getState()['features/conference'];

        /**
         * Timeout interval to call reconnect.
         *
         * @type {number}
         * @private
         */
        this._reconnectTimeout = null;

        this._handleConferenceJoined = this._handleConferenceJoined.bind(this);
        this._onConferenceFailed = this._onConferenceFailed.bind(this);
        this._onConferenceError = this._onConferenceError.bind(this);

        this._conference.on(ConferenceEvents.CONFERENCE_JOINED,
            this._handleConferenceJoined);
        this._conference.on(ConferenceEvents.CONFERENCE_FAILED,
            this._onConferenceFailed);
        this._conference.on(ConferenceEvents.CONFERENCE_ERROR,
            this._onConferenceError);
    }

    /**
     * Handles generic conference failure.
     *
     * @param {string} err - Error.
     * @private
     * @returns {void}
     */
    _handleConferenceFailed(err) {
        this._unsubscribe();
        this._reject(err);
    }

    /**
     * Handles case when conference is joined.
     *
     * @private
     * @returns {void}
     */
    _handleConferenceJoined() {
        this._unsubscribe();
        this._resolve();
    }

    /**
     * Handles specific cases of conference failure.
     *
     * @param {ConferenceErrors|string} err - Error.
     * @param {Array} params - Additional error params.
     * @private
     * @returns {void}
     */
    _onConferenceFailed(err, ...params) {
        console.error('CONFERENCE FAILED:', err, ...params);
        //APP.UI.hideRingOverLay();

        switch (err) {
        // room is locked by the password
        case ConferenceErrors.PASSWORD_REQUIRED:
            // APP.UI.markRoomLocked(true);
            // roomLocker.requirePassword().then(function () {
            //     room.join(roomLocker.password);
            // });
            break;

        case ConferenceErrors.CONNECTION_ERROR:
            // let [msg] = params;
            // APP.UI.notifyConnectionFailed(msg);
            break;

        case ConferenceErrors.VIDEOBRIDGE_NOT_AVAILABLE:
            // APP.UI.notifyBridgeDown();
            break;

        // not enough rights to create conference
        case ConferenceErrors.AUTHENTICATION_REQUIRED:
            // schedule reconnect to check if someone else created the room
            this._reconnectTimeout =
                setTimeout(() => this._conference.join(), 5000);

            // notify user that auth is required

            //AuthHandler.requireAuth(room, roomLocker.password);
            break;

        case ConferenceErrors.RESERVATION_ERROR:
            // let [code, msg] = params;
            // APP.UI.notifyReservationError(code, msg);
            break;

        case ConferenceErrors.GRACEFUL_SHUTDOWN:
            // APP.UI.notifyGracefulShutdown();
            break;

        case ConferenceErrors.JINGLE_FATAL_ERROR:
            // APP.UI.notifyInternalError();
            break;

        case ConferenceErrors.CONFERENCE_DESTROYED:
            // let [reason] = params;
            // APP.UI.hideStats();
            // APP.UI.notifyConferenceDestroyed(reason);
            break;

        case ConferenceErrors.FOCUS_DISCONNECTED:
            // let [focus, retrySec] = params;
            // APP.UI.notifyFocusDisconnected(focus, retrySec);
            break;

        case ConferenceErrors.FOCUS_LEFT:
            store.dispatch(leave())
                .then(() => store.dispatch(disconnect()));
            // APP.UI.notifyFocusLeft();
            break;
        case ConferenceErrors.CONFERENCE_MAX_USERS:
            // TODO:  ask someone who knows what can happens after disconnect
            // e.g. can we reconnect?
            //connection.disconnect();
            //APP.UI.notifyMaxUsersLimitReached();
            break;
        default:
            this._handleConferenceFailed(err);
        }
    }

    /**
     * Handles specific cases of conference errors.
     *
     * @param {ConferenceErrors|string} err - Error.
     * @param {Array} params - Additional error params.
     * @private
     * @returns {void}
     */
    _onConferenceError(err, ...params) {
        console.error('CONFERENCE Error:', err, params);
        switch (err) {
        case ConferenceErrors.CHAT_ERROR:
            // let [code, msg] = params;
            // APP.UI.showChatError(code, msg);
            break;
        default:
            console.error('Unknown error.');
        }
    }

    /**
     * Unsubscribes conference from events attached in constructor.
     *
     * @private
     * @returns {void}
     */
    _unsubscribe() {
        this._conference.off(
            ConferenceEvents.CONFERENCE_JOINED, this._handleConferenceJoined);
        this._conference.off(
            ConferenceEvents.CONFERENCE_FAILED, this._onConferenceFailed);

        if (this._reconnectTimeout !== null) {
            clearTimeout(this._reconnectTimeout);
        }

        // TODO: fix when auth is available
        //AuthHandler.closeAuth();
    }

    /**
     * Joins the conference.
     *
     * @returns {Promise}
     */
    connect() {
        this._conference.join();

        return this._promise;
    }
}