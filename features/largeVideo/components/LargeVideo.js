import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LargeVideoContainer } from './_';
import { Video } from '../../base/media';

class LargeVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videoStream: null,
            activeParticipant: null
        };
    }

    componentWillReceiveProps(nextProps) {
        let activeParticipant = getActiveParticipant(nextProps);
        let videoStream = null;

        if (activeParticipant) {
            // If current active active participant is local user and he is
            // dominant speaker and not pinned, use previous video stream.
            if (activeParticipant.local &&
                activeParticipant.speaking &&
                !activeParticipant.pinned &&
                this.state.videoStream) {
                videoStream = this.state.videoStream;
            } else {
                videoStream = getVideoStream(
                    activeParticipant, this.props.tracks);

                if (!videoStream) {
                    videoStream = this.state.videoStream;
                }
            }
        }

        this.setState({
            videoStream: videoStream,
            activeParticipant: activeParticipant
        });
    }

    render() {
        let videoStreamParticipant = getParticipantByVideoStream(
            this.state.videoStream,
            this.props.tracks,
            this.props.participants);

        // TODO: in future other stuff might be on large video.

        return (
            <LargeVideoContainer>
                {videoStreamParticipant &&
                videoStreamParticipant.videoStarted &&
                this.state.videoStream &&
                <Video
                    stream={this.state.videoStream}/>}
            </LargeVideoContainer>
        );
    }
}

/**
 * Returns active participant to show.
 * @param {Object} props
 * @returns {Participant|undefined}
 */
function getActiveParticipant(props) {
    // First get the pinned participant.
    let activeParticipant = props.participants.find(p => p.pinned);

    // If no participant is pinned, get the dominant speaker.
    if (!activeParticipant) {
        activeParticipant = props.participants.find(p => p.speaking);
    }

    // If no participant is pinned and no dominant speaker,
    // just get the local participant.
    if (!activeParticipant) {
        activeParticipant = props.participants.find(p => p.local);
    }

    return activeParticipant;
}

/**
 * Returns video stream for a specified participant.
 * @param {Participant} participant
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks
 * @returns {MediaStream|undefined}
 */
function getVideoStream(participant, tracks) {
    let videoTrack = tracks.find(t => {
        return t.isVideoTrack() &&
            ((participant.local && t.isLocal()) ||
            (!participant.local && !t.isLocal() &&
            t.getParticipantId() === participant.id));
    });

    if (videoTrack) {
        return videoTrack.getOriginalStream();
    }
}

/**
 * Returns participant corresponding to video stream.
 * @param {MediaStream} stream
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks
 * @param {Object} participants
 * @returns {Object|undefined}
 */
function getParticipantByVideoStream(stream, tracks, participants) {
    if (!stream) {
        return;
    }

    let track = tracks.find(t => t.getOriginalStream() === stream);

    if (track) {
        if (track.isLocal()) {
            return participants.find(p => p.local);
        } else {
            return participants.find(p => p.id === track.getParticipantId());
        }
    }
}

const mapStateToProps = state => {
    return {
        tracks: state['features/base/tracks'],
        participants: state['features/base/participants']
    };
};

export default connect(mapStateToProps)(LargeVideo);