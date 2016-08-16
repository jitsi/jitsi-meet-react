import icoMoonConfig from './fonts/selection.json';

/**
 * Lookup of Jitsi-specific Ico Moon icons.
 *
 * @type {Object}
 */
export const JITSI_ICONS = icoMoonConfig.icons.reduce((memo, icon) => {
    memo[icon.properties.name] = icon.icon.paths.join(' ');

    return memo;
}, {});
