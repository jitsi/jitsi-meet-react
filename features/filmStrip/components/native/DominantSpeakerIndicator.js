import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles/Styles';

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
            <View style = { styles.dominantSpeakerIndicatorBackground }>
                <Icon
                    style = { styles.dominantSpeakerIndicator }
                    name = 'bullhorn' />
            </View>
        );
    }
}
