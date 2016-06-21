import { ColorPalette } from '../../../../base/styles';

/**
 * The welcome page style.
 * TODO: Make styles more generic and reusable. Use color palette for all
 * colors.
 */
var styles = {
    /**
     * Navigator container style.
     */
    navContainer: {
        flex: 1,
        backgroundColor: '#111111'
    },
    /**
     * Application title style.
     */
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center',
        color: '#fff'
    },
    /**
     * Welcome page container style.
     */
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorPalette.jitsiBlue,
    },
    /**
     * Room input style.
     */
    textInput: {
        height: 50,
        padding: 4,
        fontSize: 23,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        color: 'black'
    },
    /**
     * Join button text style.
     */
    buttonText: {
        fontSize: 18,
        color: '#00ccff',
        alignSelf: 'center'
    },
    /**
     * Join button text style.
     */
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
};

export default styles;
