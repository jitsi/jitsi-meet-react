import { StyleSheet } from 'react-native';

/**
 * Native-specific styles for media components.
 */
const styles = StyleSheet.create({
    /**
     * Make video element fill its container.
     */
    video: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default styles;
