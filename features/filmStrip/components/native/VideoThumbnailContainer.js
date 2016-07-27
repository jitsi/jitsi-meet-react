import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';

import { styles } from './styles';

/**
 * Web version of Video Thumbnail Container component.
 * @extends Component
 */
export class VideoThumbnailContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <TouchableHighlight onPress={ this.props.onClick }>
                <View
                    style={ this.props.pinned
                        ? [ styles.thumbnail, styles.thumbnailPinned ]
                        : [ styles.thumbnail ] }>
                    { this.props.children }
                </View>
            </TouchableHighlight>
        );
    }
}

/**
 * VideoThumbnailContainer component's property types.
 *
 * @static
 */
VideoThumbnailContainer.propTypes = {
    children: React.PropTypes.node,
    pinned: React.PropTypes.bool,
    onClick: React.PropTypes.func
};
