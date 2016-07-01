import React, { Component } from 'react';
import Icon from 'react-fontawesome';



/**
 * Thumbnail badge showing that the participant is the dominant speaker in
 * the conference.
 */
export class DominantSpeakerIndicator extends Component {

    /**
     * React render method.
     *
     * @inheritdoc
     */
    render() {
        return (
            <div>
                <Icon name='bullhorn' />
            </div>
        );
    }
}

