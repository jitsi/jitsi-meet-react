import { createStyleSheet } from '../../../base/styles';

/**
 * The video screen style.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = createStyleSheet({
    /**
     * Conference container style.
     */
    conference: {
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'column'
    }
});

export default styles;
