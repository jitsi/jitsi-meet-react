/**
 * Web-specific styles for media components.
 */
const styles = {
    /**
     * Make video element fill its container.
     */
    video: {
        height: '100%',
        objectFit: 'cover',
        width: '100%'
    },

    /**
     * Transform local videos to behave like a mirror.
     */
    mirroredVideo: {
        height: '100%',
        objectFit: 'cover',
        transform: 'scaleX(-1)',
        width: '100%'
    }
};

export default styles;
