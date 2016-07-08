import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import styles from '../styles/Styles';


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
            <Icon style={styles.moderatorIndicator} name='star' />
        );
    }
}
