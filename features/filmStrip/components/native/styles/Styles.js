import { StyleSheet } from 'react-native';

import { ColorPalette } from '../../../../base/styles';

var styles = StyleSheet.create({
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
    },

    /**
     * Focused video thumbnail style.
     */
    thumbnailFocused: {
        borderColor: ColorPalette.jitsiBlue,
        borderWidth: 5
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
    }
});

export default styles;
