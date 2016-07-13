let domain = 'meet.jit.si';

module.exports = {
    connection: (
        // Override the default connection configuration. For legacy reasons,
        // use jitsi-meet's global variable config.
        (typeof config !== 'undefined' && config)

            || /* Default connection configuration */ {
                bosh: 'https://' + domain + '/http-bind',
                hosts: {
                    domain,
                    focus: 'focus.' + domain,
                    muc: 'conference.' + domain
                }
            }
    )
};
