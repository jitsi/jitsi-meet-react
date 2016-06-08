import React, { Component } from 'react';

import VideoThumbnail from './VideoThumbnail';

class RemoteVideoThumbnail extends Component {
    render() {
        return (
            <VideoThumbnail
                audioStream={this.props.audioStream}
                videoStream={this.props.videoStream}
            />
        );
    }
}

export default RemoteVideoThumbnail;
