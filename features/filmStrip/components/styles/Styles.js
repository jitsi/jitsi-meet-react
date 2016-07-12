import { ColorPalette, createStyleSheet } from '../../../base/styles';

const styles = createStyleSheet({
    /**
     * Avatar style.
     */
    avatar: {
        alignSelf: 'stretch',
        flex: 1
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
        color: 'white',
        fontSize: 15
    },

    /**
     * Dominant speaker indicator background style.
     */
    dominantSpeakerIndicatorBackground: {
        backgroundColor: ColorPalette.jitsiBlue,
        borderRadius: 15,
        bottom: 2,
        height: 15,
        left: 1,
        padding: 5,
        position: 'absolute',
        width: 15
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
        borderColor: '#424242',
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        height: 120,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: 120
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
