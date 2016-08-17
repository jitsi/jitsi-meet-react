import icoMoonConfig from './components/fonts/selection.json';

/**
 * Lookup of Jitsi-specific Ico Moon icons.
 *
 * @type {Object}
 */
export const JITSI_ICONS = new Set(icoMoonConfig.icons.reduce((memo, icon) => {
    memo.push(icon.properties.name);

    return memo;
}, []));
