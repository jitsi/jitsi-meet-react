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
        const containerStyle = this.props.pinned
            ? Object.assign({}, styles.thumbnail, styles.thumbnailPinned)
            : styles.thumbnail;

        return (
          <div
              onClick={ this.props.onClick }
              style={ containerStyle }>
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
    pinned: React.PropTypes.bool,
    onClick: React.PropTypes.func
};
