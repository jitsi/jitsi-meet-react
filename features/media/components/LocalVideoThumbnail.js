import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoThumbnail from './VideoThumbnail';

class LocalVideoThumbnail extends Component {
    render() {
        let localVideoStream;
        let localAudioStream;

        if (this.props.localTracks) {
            let videoTrack = this.props.localTracks.find(t => t.isVideoTrack());
            let audioTrack = this.props.localTracks.find(t => t.isAudioTrack());

            if (videoTrack) {
                localVideoStream = videoTrack.getOriginalStream();
            }

            if (audioTrack) {
                localAudioStream = audioTrack.getOriginalStream();
            }
        }

        return (
            <VideoThumbnail
                audioStream={localAudioStream}
                videoStream={localVideoStream}/>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        localTracks: state['features/base/tracks'].filter(track => track.isLocal())
    };
};

export default connect(mapStateToProps)(LocalVideoThumbnail);
