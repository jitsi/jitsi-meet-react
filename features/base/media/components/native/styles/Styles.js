import { StyleSheet } from 'react-native';


/**
 * Make video element fill its container.
 */
const video = {
    alignSelf: 'stretch',
    flex: 1
};


/**
 * Transform local videos to behave like a mirror.
 */
const mirroredVideo = Object.assign({}, video, {
    transform: [{ scaleX: -1 }]
});


/**
 * Native-specific styles for media components.
 */
const styles = StyleSheet.create({
    mirroredVideo,
    video
});

export default styles;
