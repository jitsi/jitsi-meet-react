import { createStyleSheet } from '../../../../base/styles';
import { styles as SharedStyles } from '../../styles';


/**
 * Native-specific styles for the film strip.
 */
export const styles = createStyleSheet(SharedStyles, {

    /**
     * Audio muted indicator style.
     */
    audioMutedIndicator: {
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1}
    },

    /**
     * Dominant speaker indicator background style.
     */
    dominantSpeakerIndicatorBackground: {
        borderRadius: 15,
        padding: 5
    },

    /**
     * Moderator indicator style.
     */
    moderatorIndicator: {
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1}
    },

    /**
     * Video thumbnail style.
     */
    thumbnail: {
        height: 80,
        width: 80
    },

   /**
     * Video muted indicator style.
     */
    videoMutedIndicator: {
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: -1}
    }
});
