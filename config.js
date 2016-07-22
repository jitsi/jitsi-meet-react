/* global config */

// Override the default connection configuration. For legacy reasons, use
// jitsi-meet's global variable config.
let connection = (typeof config !== 'undefined' && config);

if (!connection) { // Default connection configuration
    let domain = 'beta.meet.jit.si';

    // FIXME The HTTPS scheme for the BOSH URL works with meet.jit.si on both
    // mobile & Web. It also works with beta.meet.jit.si on Web. Unfortunately,
    // it doesn't work with beta.meet.jit.si on mobile. Temporarily, use the
    // HTTP scheme for the BOSH URL with beta.meet.jit.si on mobile.
    let boshProtocol;
    if (domain === 'beta.meet.jit.si') {
        if (typeof window === 'object') {
            let windowLocation = window.location;
            if (windowLocation) {
                // React Native doesn't have a window.location at the time of
                // this writing, let alone a window.location.protocol.
                boshProtocol = windowLocation.protocol;
            }
        }
        if (!boshProtocol) {
            boshProtocol = 'http:';
        }
    }
    // Default to the HTTPS scheme for the BOSH URL.
    if (!boshProtocol) {
        boshProtocol = 'https:';
    }

    connection = {
        bosh: boshProtocol + '//' + domain + '/http-bind',
        hosts: {
            domain,
            focus: 'focus.' + domain,
            muc: 'conference.' + domain
        }
    };
}

export default {
    connection
};