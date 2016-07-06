import React, { Component } from 'react';
import Icon from 'react-fontawesome';

/**
 * Thumbnail badge for displaying the video mute status of a participant.
 */
export class VideoMutedIndicator extends Component {

    /**
     * React render method.
     *
     * @inheritdoc
     */
    render() {
        // TODO: This should use video-camera-slash, but that doesn't exist in
        // the fontawesome icon set yet.
        return (
            <Icon name='eye-slash' />
        );
    }
}
