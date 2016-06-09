import React, { Component } from 'react';
import Video from './native/Video';
import BigVideoContainer from './native/BigVideoContainer';

import { connect } from 'react-redux';

class BigVideo extends Component {
    render() {
        let dominantSpeakerId;
        let videoTrack;
        let videoStream;
        let participants = this.props.participants;

        for (let id in participants) {
            if (participants.hasOwnProperty(id) && participants[id].speaking) {
                dominantSpeakerId = id;
                break;
            }
        }

        if (dominantSpeakerId) {
            videoTrack = this.props.remoteTracks.find(track => {
                return track.isVideoTrack()
                    && track.getParticipantId() === dominantSpeakerId;
            });
        } else {
            videoTrack = this.props.localTracks.find(t => t.isVideoTrack());
        }

        if (videoTrack) {
            videoStream = videoTrack.getOriginalStream();
        }

        return (
            <BigVideoContainer>
                <Video
                    stream={videoStream}/>
            </BigVideoContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.jitsi.client.user,
        localTracks: state.jitsi.localTracks,
        remoteTracks: state.jitsi.remoteTracks,
        participants: state.jitsi.participants
    };
};

export default connect(mapStateToProps)(BigVideo);
