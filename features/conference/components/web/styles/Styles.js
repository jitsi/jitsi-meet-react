/**
 * The video screen style.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = {
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
    }
};

export default styles;
