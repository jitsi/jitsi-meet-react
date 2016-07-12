import { createStyleSheet } from '../../base/styles';

const styles = createStyleSheet({
    container: {
        alignSelf: 'stretch',
        backgroundColor: 'black',
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

export default styles;
