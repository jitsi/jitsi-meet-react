import React, { Component } from 'react';

import VideoThumbnail from './VideoThumbnail';

import { connect } from 'react-redux';

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
        user: state.client.user,
        localTracks: state.localTracks
    };
};

export default connect(mapStateToProps)(LocalVideoThumbnail);
