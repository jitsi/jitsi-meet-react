import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the video thumbnails.
 */
export class ParticipantsContainer extends Component {
    render() {
        return (
          <View style = { styles.filmStrip }>{ this.props.children }</View>
        );
    }
}
