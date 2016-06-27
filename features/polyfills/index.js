require('./browserify');
require('./browser');

const jQuery = require('jquery');
jQuery(window);
require('strophe');
require('strophejs-plugins/disco/strophe.disco');
require('strophejs-plugins/caps/strophe.caps.jsonly');

const JitsiMeetJS = require('lib-jitsi-meet');


module.exports = { jQuery, JitsiMeetJS };
