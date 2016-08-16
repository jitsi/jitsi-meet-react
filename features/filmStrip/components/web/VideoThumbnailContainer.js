import React, { Component } from 'react';

import { styles } from './styles';

/**
 * The video thumbnail web container.
 */
export class VideoThumbnailContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let style = styles.thumbnail;

        if (this.props.pinned) {
            style = {
                ...style,
                ...styles.thumbnailPinned
            };
        }

        return (
            <div
                onClick = { this.props.onClick }
                style = { style }>
                { this.props.children }
            </div>
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
