import React, { Component } from 'react';

import { Icon } from '../../base/fontIcons';

import { styles } from './styles';

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
            <Icon
                name = 'mic-disabled'
                style = { styles.audioMutedIndicator } />
        );
    }
}
