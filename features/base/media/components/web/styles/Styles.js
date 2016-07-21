/**
 * Make video element fill its container.
 */
const video = {
    height: '100%',
    objectFit: 'cover',
    width: '100%'
};

/**
 * Transform local videos to behave like a mirror.
 */
const mirroredVideo = Object.assign({}, video, {
    transform: 'scaleX(-1)',
});


/**
 * Web-specific styles for media components.
 */
const styles = {
    mirroredVideo,
    video
};

export default styles;
