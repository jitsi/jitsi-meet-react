import { StyleSheet, Dimensions } from 'react-native';

/**
 * The video screen style.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = StyleSheet.create({
    /**
     * Conference container style.
     */
    conference: {
        alignSelf: 'stretch',
        flex: 1
    },
    /**
     * Video thumbnail style.
     */
    thumbnail: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderWidth: 1,
        flex: 1
    }
});

export default styles;
