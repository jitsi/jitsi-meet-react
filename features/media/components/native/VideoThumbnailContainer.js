import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The video thumbnail native container.
 */
export class VideoThumbnailContainer extends Component {
    render() {
        return (
          <View style = { styles.thumbnail }>{ this.props.children }</View>
        );
    }
}

VideoThumbnailContainer.propTypes = {
    children: React.PropTypes.element
};
