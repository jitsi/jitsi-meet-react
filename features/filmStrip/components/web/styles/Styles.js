import { createStyleSheet } from '../../../../base/styles';

import { styles as platformIndependentStyles } from '../../styles';

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
     * Make avatars expand to fill their container.
     */
    avatar: {
        height: '100%',
        objectFit: 'cover',
        width: '100%'
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
