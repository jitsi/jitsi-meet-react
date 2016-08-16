import { createStyleSheet } from '../../../base/styles';

/**
 * The style of the conference UI (component).
 * TODO Make styles more generic and reusable. Use ColorPalette for all colors.
 */
export const styles = createStyleSheet({
    /**
     * Avatar style.
     */
    avatar: {
        alignSelf: 'stretch',
        flex: 1
    },

    /**
     * Conference container style.
     */
    conference: {
        alignSelf: 'stretch',
        backgroundColor: '#111111',
        flex: 1,
        flexDirection: 'column'
    }
});
