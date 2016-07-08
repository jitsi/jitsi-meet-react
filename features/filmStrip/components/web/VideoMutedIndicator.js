import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import styles from '../styles/Styles';


/**
 * Thumbnail badge for displaying the video mute status of a participant.
 */
export class VideoMutedIndicator extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        // TODO: This should use video-camera-slash, but that doesn't exist in
        // the fontawesome icon set yet.
        return (
            <Icon style={styles.videoMutedIndicator} name='eye-slash' />
        );
    }
}
