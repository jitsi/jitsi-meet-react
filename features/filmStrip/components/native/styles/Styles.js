import { StyleSheet } from 'react-native';

import { ColorPalette } from '../../../../base/styles';

const styles = StyleSheet.create({

    /**
     * Avatar style.
     */
    avatar: {
        flex: 1,
        alignSelf: 'stretch'
    },

    /**
     * Audio muted indicator style.
     */
    audioMutedIndicator: {
        backgroundColor: 'transparent',
        color: 'white',
        left: 20,
        position: 'absolute',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1},
        top: 1
    },

    /**
     * Dominant speaker indicator style.
     */
    dominantSpeakerIndicator: {
        color: 'white'
    },

    /**
     * Dominant speaker indicator background style.
     */
    dominantSpeakerIndicatorBackground: {
        backgroundColor: ColorPalette.jitsiBlue,
        borderRadius: 10,
        bottom: 2,
        left: 1,
        padding: 5,
        position: 'absolute'
    },

    /**
     * Participants container style.
     */
    filmStrip: {
        alignSelf: 'stretch',
        bottom: 110,
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        right: 5
    },

    /**
     * Moderator indicator style.
     */
    moderatorIndicator: {
        backgroundColor: 'transparent',
        color: 'white',
        left: 1,
        position: 'absolute',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1},
        top: 1
    },

    /**
     * Video thumbnail style.
     */
    thumbnail: {
        alignItems: 'center',
        backgroundColor: 'black',
        // TODO: This should go into the color palette
        borderColor: '#424242',
        borderWidth: 1,
        flex: 1,
        height: 80,
        justifyContent: 'center',
        width: 80
    },

    /**
     * Focused video thumbnail style.
     */
    thumbnailFocused: {
        borderColor: ColorPalette.jitsiBlue,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 5
        },
        shadowRadius: 5
    },

    /**
     * Video muted indicator style.
     */
    videoMutedIndicator: {
        backgroundColor: 'transparent',
        color: 'white',
        left: 35,
        position: 'absolute',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1},
        top: 1
    }
});

export default styles;
