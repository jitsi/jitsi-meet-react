/* global config */

// Override the default configuration. For legacy reasons, use
// jitsi-meet's global variable config.
let configObject = typeof config !== 'undefined' && config;

if (!configObject) { // Default connection configuration
    configObject = {
        hosts: {
            domain: 'meet.jit.si'
        }
    };
}

// FIXME Lib-jitsi-meet uses HTML script elements to asynchronously
// load certain pieces of JavaScript. Unfortunately, the technique
// doesn't work on React Native (because there are no HTML elements
// in the first place). Fortunately, these pieces of JavaScript
// currently involve third parties and we can temporarily disable
// them (until we implement an alternative to async script elements
// on React Native).
configObject.disableThirdPartyRequests = true;

export default configObject;
