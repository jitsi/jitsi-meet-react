import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles/Styles';

/**
 * Thumbnail badge showing that the participant is a conference moderator.
 */
export class ModeratorIndicator extends Component {

    /**
     * React render method.
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
