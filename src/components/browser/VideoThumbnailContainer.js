import React, { Component } from 'react';

export default class VideoThumbnailContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}
