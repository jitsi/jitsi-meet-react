require('./browser');
require('./browserify');

const jQuery = require('jquery');
jQuery(window);
window.$ = jQuery;

require('strophe');
require('strophejs-plugins/disco/strophe.disco');
require('strophejs-plugins/caps/strophe.caps.jsonly');

module.exports = { jQuery };

