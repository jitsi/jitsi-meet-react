import { ColorPalette, createStyleSheet } from '../../../base/styles';

export const styles = createStyleSheet({
    container: {
        alignSelf: 'stretch',
        backgroundColor: ColorPalette.appBackground,
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    /**
     * Large video container style.
     */
    largeVideo: {
        alignSelf: 'stretch',
        flex: 1
    }
});
