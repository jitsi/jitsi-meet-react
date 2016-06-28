import React, { Component } from 'react';

export class VideoThumbnailContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}

VideoThumbnailContainer.propTypes = {
    children: React.PropTypes.element
};