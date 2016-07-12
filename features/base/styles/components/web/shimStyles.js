/**
 * Shim style properties to work correctly on Web.
 *
 * @param {Object} styles - A dictionary of named style definitions.
 * @returns {Object} */
export function shimStyles(styles) {
    // The `display` field only applies to web, so we stamp the necessary
    // `display: 'flex'` if flexbox styling is being used. That way we can
    // share as much as possible between web and native.
    if (styles.flex) {
        styles.display = 'flex';
    }

    return styles;
}
