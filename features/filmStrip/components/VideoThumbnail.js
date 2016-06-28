import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    participantPinned,
    participantVideoStarted
} from '../../base/participants';

import {
    Audio,
    Video
} from '../../base/media';

import { VideoThumbnailContainer } from './_';

class VideoThumbnail extends Component {
    /**
     * Pins current participant.
     */
    pinParticipant() {
        // TODO: for now do not pin local participant. In future he will be
        // "selected".
        if (this.props.participant.local) {
            return;
        }

        this.props.dispatch(participantPinned(this.props.participant.pinned
            ? null
            : this.props.participant.id));
    }

    /**
     * Marks video of participant as started.
     */
    videoStarted() {
        this.props.dispatch(participantVideoStarted(this.props.participant.id));
    }

    /**
     * Returns audio and video media streams for participant.
     * @returns {{video: MediaStream|null, audio: MediaStream}}
     */
    getMediaStreams() {
        return {
            video: this.props.videoTrack
                ? this.props.videoTrack.getOriginalStream()
                : null,
            audio: this.props.audioTrack
                ? this.props.audioTrack.getOriginalStream()
                : null
        };
    }

    render() {
        let streams = this.getMediaStreams();

        return (
            <VideoThumbnailContainer
                pinned={this.props.participant.pinned}
                onClick={this.pinParticipant.bind(this)}>
                {streams.video && <Video
                    stream={streams.video}
                    onPlaying={this.videoStarted.bind(this)}/>}
                {streams.audio && <Audio
                    stream={streams.audio}/>}
            </VideoThumbnailContainer>
        );
    }
}

export default connect()(VideoThumbnail);