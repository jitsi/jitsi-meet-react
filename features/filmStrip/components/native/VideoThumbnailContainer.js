import React, { Component } from 'react';
import {
    TouchableHighlight,
    View
} from 'react-native';

import styles from './styles/Styles';

/**
 * The video thumbnail native container.
 */
export class VideoThumbnailContainer extends Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onClick}>
                <View
                    style = { this.props.pinned
                        ? [ styles.thumbnail, styles.thumbnailFocused ]
                        : [ styles.thumbnail ] }>
                    { this.props.children }
                </View>
            </TouchableHighlight>
        );
    }
}
