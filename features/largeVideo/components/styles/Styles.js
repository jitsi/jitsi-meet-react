import { ColorPalette, createStyleSheet } from '../../../base/styles';

export const styles = createStyleSheet({
    /**
     * Styles for dominant speaker avatar.
     */
    dominantSpeakerAvatar: {
        alignSelf: 'center',
        borderRadius: 100,
        flex: 0,
        height: 200,
        width: 200
    },

    /**
     * Large video container style.
     */
    largeVideo: {
        alignItems: 'center',
        backgroundColor: ColorPalette.appBackground,
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    }
});
