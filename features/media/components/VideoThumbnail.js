import React, { Component } from 'react';

// TODO: import depending on environment
import Audio from './native/Audio';
import Video from './native/Video';
import VideoThumbnailContainer from './native/VideoThumbnailContainer';
// import Audio from './browser/Audio';
// import Video from './browser/Video';
// import VideoThumbnailContainer from './browser/VideoThumbnailContainer';

class VideoThumbnail extends Component {
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

export default VideoThumbnail;
