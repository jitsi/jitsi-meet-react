/**
 * Create a style sheet using the provided style definitions.
 *
 * This method is a noop for the web platform.
 *
 * @param {Object} styles - A dictionary of named style definitions.
 * @returns {Object}
 */
export function createStyleSheet(styles) {

    // The `display` field only applies to web, so we stamp the necessary
    // `display: 'flex'` if flexbox styling is being used so that we can
    // share as much as possible between web and native.
    Object.keys(styles).forEach(function (key) {
        let style = styles[key];

        if (style.flex) {
            style.display = 'flex';
        }
    });

    return styles;
}

