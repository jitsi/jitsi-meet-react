import React, { Component } from 'react';

import { Audio, Video, VideoThumbnailContainer } from './_';

export default class VideoThumbnail extends Component {
    render() {
        return (
            <VideoThumbnailContainer>
                <Video
                    stream={this.props.videoStream}/>
                <Audio
                    stream={this.props.audioStream}/>
            </VideoThumbnailContainer>
        );
    }
}

VideoThumbnail.propTypes = {
    videoStream: React.PropTypes.object,
    audioStream: React.PropTypes.object
};
