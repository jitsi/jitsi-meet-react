let domain = 'meet.jit.si';

module.exports = {
    bosh: 'https://' + domain + '/http-bind',
    hosts: {
        domain,
        focus: 'focus.' + domain,
        muc: 'conference.' + domain
    },
    openSctp: true // Toggle to enable/disable SCTP channels
};
