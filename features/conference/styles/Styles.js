import { createStyleSheet } from '../../base/styles';

/**
 * The style of the conference UI (component).
 * TODO Make styles more generic and reusable. Use ColorPalette for all colors.
 */
const styles = createStyleSheet({
    /**
     * Conference container style.
     */
    conference: {
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#111111'
    }
});

export default styles;
