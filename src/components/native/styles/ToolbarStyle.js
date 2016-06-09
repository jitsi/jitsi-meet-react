import { StyleSheet } from 'react-native';

var styles = StyleSheet.create({
    toolbarContainer: {
        height: 70,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    toolbarButton: {
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#00ccff',
      marginLeft: 20,
      marginRight: 20,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    hangupButton: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: '#ff0000',
        marginLeft: 20,
        marginRight: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center'
    }
});

export default styles;
