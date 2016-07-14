import { shimStyles } from './_';

/**
 * Create a style sheet using the provided style definitions.
 *
 * @param {Object} styles - A dictionary of named style definitions.
 * @param {Object} [platformSpecific={}] - Optional set of additional platform
 *     specific style definitions that will override the base styles.
 * @returns {Object}
 */
export function createStyleSheet(styles, platformSpecific={}) {
    let combinedStyles = {};
    
    for (let key of Object.keys(styles)) {
        combinedStyles[key] = shimStyles(Object.assign(
            {},
            styles[key],
            platformSpecific[key] || {}));
    }

    return combinedStyles;
}
