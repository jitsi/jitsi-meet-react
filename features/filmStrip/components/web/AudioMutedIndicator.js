import React, { Component } from 'react';
import Icon from 'react-fontawesome';


/**
 * Thumbnail badge for displaying the audio mute status of a participant.
 */
export class AudioMutedIndicator extends Component {

    /**
     * React render method.
     *
     * @inheritdoc
     */
    render() {
        return (
            <Icon name='microphone-slash' />
        );
    }
}

