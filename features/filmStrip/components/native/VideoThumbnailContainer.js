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
        let style = [ styles.thumbnail ];

        if (this.props.pinned) {
            style = [ ...style, styles.thumbnailPinned ];
        }

        return (
            <TouchableHighlight onPress = { this.props.onClick }>
                <View
                    style = { style }>
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
    onClick: React.PropTypes.func,
    pinned: React.PropTypes.bool
};
