import React, { Component } from 'react';

import { Icon } from '../../base/fontIcons';

import { styles } from './_';

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
        return (
            <Icon
                name = 'camera-disabled'
                style = { styles.videoMutedIndicator } />
        );
    }
}
