/* global config */

// Override the default configuration. For legacy reasons, use jitsi-meet's
// global variable config.
let configObject = typeof config !== 'undefined' && config;

if (!configObject) {
    configObject = {
        configLocation: './config.js',
        hosts: {
            domain: 'meet.jit.si'
        }
    };
}

export default configObject;
