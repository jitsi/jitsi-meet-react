const jQuery = require('jquery');
require('./browser');
jQuery(window);
require('strophe');
require('strophejs-plugins/disco/strophe.disco');
require('strophejs-plugins/caps/strophe.caps.jsonly');
require('./browserify');

module.exports = { jQuery };
