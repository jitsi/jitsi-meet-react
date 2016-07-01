/**
 * Gets the first common prototype of two specified Objects (treating the
 * Objects themselves as prototypes as well).
 *
 * @param {Object} a - the first prototype chain to climb in search of a common
 *      prototype
 * @param {Object} b - the second prototype chain to climb in search of a common
 *      prototype
 * @returns {Object|undefined} - the first common prototype of a and b
 */
function _getCommonPrototype(a, b) {
    // Allow the arguments to be prototypes themselves.
    if (a === b) {
        return a;
    }

    let p;

    if ((p = Object.getPrototypeOf(a)) && (p = _getCommonPrototype(b, p))) {
        return p;
    }
    if ((p = Object.getPrototypeOf(b)) && (p = _getCommonPrototype(a, p))) {
        return p;
    }

    return undefined;
}

/**
 * Implements an absolute minimum of the common logic of Document.querySelector
 * and Element.querySelector. Implements the most simple of selectors necessary
 * to satisfy the call sites at the time of this writing i.e. select by tagName.
 *
 * @param {Node} node - the Node which is the root of the tree to query
 * @param {string} selectors - the group of CSS selectors to match on
 * @returns {Element} - the first Element which is a descendant of the specified
 * node and matches the specified group of selectors
 */
function _querySelector(node, selectors) {
    let element = null;
    if (node) {
        _visitNode(node, function (node) {
            if (node.nodeType == 1 /* ELEMENT_NODE */
                && node.nodeName == selectors) {
                element = node;
                return true;
            } else {
                return false;
            }
        });
    }
    return element;
}

/**
 * Visits each Node in the tree of a specific root Node (using depth-first
 * traversal) and invokes a specific callback until the callback returns true.
 *
 * @param {Node} node - the root Node which represents the tree of Nodes to
 *      visit
 * @param {Function} callback - the callback to invoke with each visted Node
 * @returns {boolean} - true if the specified callback returned true for a Node;
 *      otherwise, false
 */
function _visitNode(node, callback) {
    if (callback(node)) {
        return true;
    }
    if ((node = node.firstChild)) {
        do {
            if (_visitNode(node, callback)) {
                return true;
            }
        } while ((node = node.nextSibling));
    }
    return false;
}

(function (global) {

    let DOMParser = require('xmldom').DOMParser;

    // addEventListener
    //
    // Required by:
    // - jQuery
    if (typeof global.addEventListener === 'undefined') {
        global.addEventListener = function () {
        };
    }
    // document
    //
    // Required by:
    // - jQuery
    // - lib-jitsi-meet/modules/RTC/adapter.screenshare.js
    // - Strophe
    if (typeof global.document === 'undefined') {
        let document
            = new DOMParser().parseFromString(
            /* source */ '<html><head></head><body></body></html>',
            /* mineType */ 'text/xml');

        // document.addEventListener
        //
        // Required by:
        // - jQuery
        if (typeof document.addEventListener === 'undefined') {
            document.addEventListener = function () {
            };
        }

        // Document.querySelector
        //
        // Required by:
        // - strophejs-plugins/caps/strophe.caps.jsonly.js
        let documentPrototype = Object.getPrototypeOf(document);
        if (documentPrototype) {
            if (typeof documentPrototype.querySelector === 'undefined') {
                documentPrototype.querySelector = function (selectors) {
                    return _querySelector(this.elementNode, selectors);
                };
            }
        }
        // Element.querySelector
        //
        // Required by:
        // - strophejs-plugins/caps/strophe.caps.jsonly.js
        let elementPrototype = Object.getPrototypeOf(document.documentElement);
        if (elementPrototype) {
            if (typeof elementPrototype.querySelector === 'undefined') {
                elementPrototype.querySelector = function (selectors) {
                    return _querySelector(this, selectors);
                };
            }
        }
        // FIXME There is a weird infinite loop related to console.log and
        // Document and/or Element at the time of this writing. Work around it
        // by patching Node and/or overriding console.log.
        let nodePrototype
            = _getCommonPrototype(documentPrototype, elementPrototype);
        if (nodePrototype
            // XXX The intention was to find Node from which Document and
            // Element extend. If for whatever reason we've reached Object, then
            // it doesn't sound like what expected.
            && nodePrototype !== Object.getPrototypeOf({})) {
            // Override console.log.
            let console = global.console;
            if (console) {
                let loggerLevels = require('jitsi-meet-logger').levels;
                Object.keys(loggerLevels).forEach(function (key) {
                    let level = loggerLevels[key];
                    let consoleLog = console[level];
                    if (typeof consoleLog === 'function') {
                        console[level] = function () {
                            let length = arguments.length;
                            let args = new Array(length);
                            for (let i = 0; i < length; ++i) {
                                let arg = arguments[i];
                                if (arg
                                    && typeof arg !== 'string'
                                    // Limit the console.log override to Node
                                    // (instances).
                                    && nodePrototype.isPrototypeOf(arg)) {
                                    let toString = arg.toString;
                                    if (toString) {
                                        arg = toString.call(arg);
                                    }
                                }
                                args[i] = arg;
                            }
                            consoleLog.apply(this, args);
                        };
                    }
                });
            }
        }

        global.document = document;
    }
    // location
    if (typeof global.location === 'undefined') {
        global.location = {
            href: ''
        };
    }
    // performance
    if (typeof global.performance === 'undefined') {
        global.performance = {
            now: function () {
                return 0;
            }
        };
    }
    // sessionStorage
    //
    // Required by:
    // - Strophe
    if (typeof global.sessionStorage === 'undefined') {
        global.sessionStorage = {
            getItem: function () {
            },
            removeItem: function () {
            },
            setItem: function () {
            }
        };
    }

    let navigator = global.navigator;
    if (navigator) {
        // platform
        //
        // Required by:
        // - lib-jitsi-meet/modules/RTC/adapter.screenshare.js
        if (typeof navigator.platform === 'undefined') {
            navigator.platform = '';
        }
        // plugins
        //
        // Required by:
        // - lib-jitsi-meet/modules/RTC/adapter.screenshare.js
        if (typeof navigator.plugins === 'undefined') {
            navigator.plugins = [];
        }
        // userAgent
        //
        // Required by:
        // - lib-jitsi-meet/modules/RTC/adapter.screenshare.js
        // - lib-jitsi-meet/modules/RTC/RTCBrowserType.js
        (function () {
            let reactNativePackageJSON = require('react-native/package.json');
            let userAgent = reactNativePackageJSON.name || 'react-native';

            let version = reactNativePackageJSON.version;
            if (version)
                userAgent += '/' + version;

            if (typeof navigator.userAgent !== 'undefined') {
                let s = navigator.userAgent.toString();
                if (s.length > 0 && s.indexOf(userAgent) === -1) {
                    userAgent = s + ' ' + userAgent;
                }
            }

            // Required by:
            // - lib-jitsi-meet/modules/RTC/adapter.screenshare.js
            userAgent += ' Chrome/31.';

            navigator.userAgent = userAgent;
        })();
    }

    // WebRTC
    require('./polyfills-webrtc');

    // XMLHttpRequest
    if (global.XMLHttpRequest) {
        let prototype = global.XMLHttpRequest.prototype;
        // XMLHttpRequest.responseXML
        //
        // Required by:
        // - Strophe
        if (prototype && typeof prototype.responseXML === 'undefined') {
            Object.defineProperty(prototype, 'responseXML', {
                configurable: true,
                enumerable: true,
                get: function () {
                    let responseText = this.responseText;
                    let responseXML;
                    if (responseText) {
                        responseXML = new DOMParser()
                            .parseFromString(responseText);
                    }
                    return responseXML;
                }
            });
        }
    }

})(global || window || this);
