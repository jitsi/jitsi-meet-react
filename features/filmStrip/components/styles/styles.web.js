import { createStyleSheet } from '../../../base/styles';

import { styles as platformIndependentStyles } from './baseStyles';

/**
 * Web-specific styles for the film strip.
 */
export const styles = createStyleSheet(platformIndependentStyles, {

    /**
     * Audio muted indicator style.
     */
    audioMutedIndicator: {
        fontSize: 15,
        textShadow: '1px 1px 2px black',
        top: 4
    },

    /**
     * Dominant speaker indicator background style.
     */
    dominantSpeakerIndicatorBackground: {
        height: 15,
        width: 15
    },

    /**
     * Moderator indicator style.
     */
    moderatorIndicator: {
        textShadow: '1px 1px 2px black'
    },

    /**
     * Video thumbnail style.
     */
    thumbnail: {
        height: 120,
        width: 120
    },

    /**
     * Video muted indicator style.
     */
    videoMutedIndicator: {
        fontSize: 15,
        left: 40,
        textShadow: '1px 1px 2px black',
        top: 4
    }
});
