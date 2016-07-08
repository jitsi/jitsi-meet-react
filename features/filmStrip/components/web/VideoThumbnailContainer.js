import React, { Component } from 'react';

import styles from '../styles/Styles';

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
        const containerStyle = this.props.focused
            ? Object.assign({}, styles.thumbnail, styles.thumbnailFocused)
            : styles.thumbnail;

        return (
          <div onClick={this.props.onClick}
               style = { containerStyle }>
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
    onClick: React.PropTypes.func,
    focused: React.PropTypes.bool,
    children: React.PropTypes.node
};
