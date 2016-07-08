import { StyleSheet } from 'react-native';

/**
 * Create a native style sheet using the provided style definitions.
 *
 * @param {Object} styles - A dictionary of named style definitions.
 * @returns {StyleSheet}
 */
export function createStyleSheet(styles) {
    return StyleSheet.create(styles);
}
