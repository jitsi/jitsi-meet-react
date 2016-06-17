import { StyleSheet } from 'react-native';

import ColorPalette from '../../../../base/styles/components/native/styles/ColorPalette';

/**
 * The toolbar related styles.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = StyleSheet.create({
    /**
     * The toolbar container style.
     */
    toolbarContainer: {
        height: 70,
        bottom: 30,
        left: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute'
    },
    /**
     * The toolbar button style.
     */
    toolbarButton: {
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: ColorPalette.jitsiBlue,
      marginLeft: 20,
      marginRight: 20,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    /**
     * The toolbar button icon style.
     */
    icon: {
        fontSize: 24,
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center'
    }
});

export default styles;
