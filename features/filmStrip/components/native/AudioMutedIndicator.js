import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles/Styles';


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
            <Icon
                name = 'microphone-slash'
                style = { styles.audioMutedIndicator } />
        );
    }
}

