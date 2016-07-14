/**
 * Shim style properties to work correctly on Web.
 * 
 * Some generic properties used by react-native for styling require additional
 * style fields to be included in order to work on Web. For example, setting the
 * `flex` property to control the flexbox layout also requires setting the
 * `display` property to `flexbox` for the `flex` style to take effect.
 * 
 * Using this shimStyles method allows us to minimize the number of style
 * declarations that need to be set or overridden for specific platforms.
 *
 * @param {Object} styles - A dictionary of named style definitions.
 * @returns {Object}i
 */
export function shimStyles(styles) {
    // The `display` field only applies to web, so we stamp the necessary
    // `display: 'flex'` if flexbox styling is being used. That way we can
    // share as much as possible between web and native.
    if (styles.flex) {
        styles.display = 'flex';
    }

    return styles;
}
