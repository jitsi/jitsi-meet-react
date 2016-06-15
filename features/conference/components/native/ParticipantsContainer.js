import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from '../../../media/components/native/styles/VideoStyle';

/**
 * The native container rendering the video thumbnails.
 */
export default class ParticipantsContainer extends Component {
    render() {
        return (
          <View style = { styles.filmStrip }>{ this.props.children }</View>
        );
    }
}
