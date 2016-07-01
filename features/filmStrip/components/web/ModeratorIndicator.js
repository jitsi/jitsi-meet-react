import React, { Component } from 'react';
import Icon from 'react-fontawesome';


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
            <Icon name='star' />
        );
    }
}

