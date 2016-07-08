import { ColorPalette, createStyleSheet } from '../../../base/styles';

/**
 * The toolbar related styles.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = createStyleSheet({
    /**
     * The toolbar container style.
     */
    toolbarContainer: {
        bottom: 30,
        flex: 1,
        flexDirection: 'row',
        height: 70,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center'
    },
    /**
     * The toolbar button style.
     */
    toolbarButton: {
        alignSelf: 'center',
        backgroundColor: ColorPalette.jitsiBlue,
        borderRadius: 35,
        borderWidth: 0,
        flexDirection: 'row',
        height: 70,
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        width: 70
    },
    /**
     * The toolbar button icon style.
     */
    icon: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 24,
        textAlign: 'center'
    }
});

export default styles;
