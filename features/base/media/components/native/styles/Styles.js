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
    },

    /**
     * Transform local videos to behave like a mirror.
     */
    mirroredVideo: {
        alignSelf: 'stretch',
        flex: 1,
        transform: [{ scaleX: -1 }]
    }
});

export default styles;
