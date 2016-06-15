import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/VideoStyle';

/**
 * The video thumbnail native container.
 */
export default class VideoThumbnailContainer extends Component {
    render() {
        return (
          <View style = { styles.thumbnail }>{ this.props.children }</View>
        );
    }
}
