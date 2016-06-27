import './_';

(function (global) {
    // jQuery
    if (typeof window.$ === 'undefined') {
        const jQuery = require('jquery');
        jQuery(global);
        global.$ = jQuery;
    }

    // Strophe
    if (typeof global.Strophe === 'undefined') {
        require('strophe');
        if (typeof global.Strophe !== 'undefined') {
            require('strophejs-plugins/disco/strophe.disco');
            require('strophejs-plugins/caps/strophe.caps.jsonly');
        }
    }
})(global || window || this);

import JitsiMeetJS from 'lib-jitsi-meet';
export { JitsiMeetJS as default };
