import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoThumbnail from './VideoThumbnail';

class RemoteVideoThumbnail extends Component {
    render() {
        let id = this.props.participantId;
        let videoStream;
        let audioStream;

        if (this.props.remoteTracks) {
            let videoTrack = this.props.remoteTracks.find(
                t => t.isVideoTrack() && t.getParticipantId() === id);
            let audioTrack = this.props.remoteTracks.find(
                t => t.isAudioTrack() && t.getParticipantId() === id);

            if (videoTrack) {
                videoStream = videoTrack.getOriginalStream();
            }

            if (audioTrack) {
                audioStream = audioTrack.getOriginalStream();
            }
        }

        return (
            <VideoThumbnail
                audioStream={audioStream}
                videoStream={videoStream}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        remoteTracks: state.remoteTracks,
        participants: state.participants
    };
};

export default connect(mapStateToProps)(RemoteVideoThumbnail);
