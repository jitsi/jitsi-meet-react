import React, { Component } from 'react';
import { roomNameSet } from '../../base/conference';

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends Component {
    /**
     * Initializes a new App instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);

        let roomName = this._getRoomNameFromUrl(props.url, props.config);

        props.store.dispatch(roomNameSet(roomName));
    }

    /**
     * Tries to get conference room name from URL.
     *
     * @param {(string|undefined)} url - URL passed to the app.
     * @param {Object} config - Configuration object.
     * @protected
     * @returns {string}
     */
    _getRoomNameFromUrl(url, config) {
        let urlObj = this._urlStringToObject(url, config);

        return this._getRoomNameFromUrlObject(urlObj);
    }

    /**
     * Gets room name from URL object.
     *
     * @param {URL} url - URL object.
     * @protected
     * @returns {string}
     */
    _getRoomNameFromUrlObject(url) {
        return url.pathname.substr(1).toLowerCase();
    }

    /**
     * Utility function that converts string URL to object representation with
     * app specifics.
     *
     * @param {(string|undefined)} url - URL passed to the app.
     * @param {Object} config - Configuration object.
     * @protected
     * @returns {URL}
     */
    _urlStringToObject(url, config) {
        let urlObj;

        try {
            urlObj = new URL(url);
        } catch (ex) {
            urlObj = new URL('https://' + config.connection.hosts.domain);
        }

        return urlObj;
    }
}

/**
 * AbstractApp component's property types.
 *
 * @static
 */
AbstractApp.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object,
    /**
     * The URL, if any, with which the app was launched. Supported on Android
     * and web only at the time of this writing.
     */
    url: React.PropTypes.string
};