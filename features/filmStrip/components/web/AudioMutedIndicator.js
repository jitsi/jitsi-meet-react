import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import styles from '../styles/Styles';


/**
 * Thumbnail badge for displaying the audio mute status of a participant.
 */
export class AudioMutedIndicator extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <Icon style={styles.audioMutedIndicator} name='microphone-slash' />
        );
    }
}
