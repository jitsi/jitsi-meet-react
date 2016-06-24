import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BigVideoContainer, Video } from './_';

class BigVideo extends Component {
    render() {
        let videoStream = getDominantSpeakerVideoStream(
            this.props.participants,
            this.props.remoteTracks,
            this.props.localTracks);

        return (
            <BigVideoContainer>
                {videoStream && <Video
                    stream={videoStream}/>}
            </BigVideoContainer>
        );
    }
}

/**
 * Gets video stream of a dominant speaker.
 *
 * @param {object[]} participants
 * @param {JitsiRemoteTrack[]} remoteTracks
 * @param {JitsiRemoteTrack[]} localTracks
 */
function getDominantSpeakerVideoStream(
    participants, remoteTracks, localTracks) {
    let dominantSpeakerId;
    let videoTrack;

    for (let id in participants) {
        if (participants.hasOwnProperty(id) && participants[id].speaking) {
            dominantSpeakerId = id;
            break;
        }
    }

    if (dominantSpeakerId) {
        videoTrack = remoteTracks.find(track => {
            return track.isVideoTrack()
                && track.getParticipantId() === dominantSpeakerId;
        });
    } else {
        videoTrack = localTracks.find(t => t.isVideoTrack());
    }

    if (videoTrack) {
        return videoTrack.getOriginalStream();
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        localTracks: state.localTracks,
        remoteTracks: state.remoteTracks,
        participants: state.participants
    };
};

BigVideo.propTypes = {
    localTracks: React.PropTypes.array,
    remoteTracks: React.PropTypes.array,
    participants: React.PropTypes.object
};

export default connect(mapStateToProps)(BigVideo);
