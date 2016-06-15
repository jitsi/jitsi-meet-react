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
     * Participants container style.
     */
    filmStrip: {
        alignSelf: 'stretch',
        flex: 1,
        right: 5,
        bottom: 110,
        position: 'absolute',
        flexDirection: 'row'
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
