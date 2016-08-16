import React, { Component } from 'react';

import { Icon } from '../../base/fontIcons';

import { styles } from './_';

/**
 * Thumbnail badge showing that the participant is a conference moderator.
 */
export class ModeratorIndicator extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <Icon
                name = 'star'
                style = { styles.moderatorIndicator } />
        );
    }
}
