import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';

import styles from './styles/Styles';

/**
 * Web version of Video Thumbnail Container component.
 * @extends Component
 */
export class VideoThumbnailContainer extends Component {
    /**
     * Implements React Component's render method.
     *
     * @inheritdoc
     * @returns {XML} - JSX markup.
     */
    render() {
        return (
            <TouchableHighlight onPress={this.props.onClick}>
                <View
                    style = { this.props.focused
                        ? [ styles.thumbnail, styles.thumbnailFocused ]
                        : [ styles.thumbnail ] }>
                    { this.props.children }
                </View>
            </TouchableHighlight>
        );
    }
}

/**
 * React PropTypes for VideoThumbnailContainer component.
 * 
 * @static
 */
VideoThumbnailContainer.propTypes = {
    onClick: React.PropTypes.func,
    focused: React.PropTypes.bool,
    children: React.PropTypes.node
};
