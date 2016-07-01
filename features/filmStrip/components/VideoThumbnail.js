import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Audio, Video } from '../../base/media';
import {
    participantFocused,
    participantPinned,
    participantVideoStarted
} from '../../base/participants';

import { VideoThumbnailContainer } from './_';

/**
 * React component for video thumbnail.
 * @extends Component
 */
class VideoThumbnail extends Component {
    /**
     * Handles click/tap event on the thumbnail. Prevents further event
     * propagation.
     * @param {Event} event
     * @returns {false}
     */
    onClickHandler(event) {
        this.handleVideoThumbClicked();

        // On IE we need to populate this handler on video <object>
        // and it does not give event instance as an argument,
        // so we check here for methods.
        if (event && event.stopPropagation && event.preventDefault) {
            event.stopPropagation();
            event.preventDefault();
        }

        return false;
    }

    /**
     * Processes click on video thumbnail.
     * @returns {void}
     */
    handleVideoThumbClicked () {
        // TODO: this currently ignores interfaceConfig.filmStripOnly
        this.props.dispatch(participantFocused(
            this.props.participant.focused
                ? null
                : this.props.participant.id));

        this.props.dispatch(participantPinned(
            this.props.participant.pinned
                ? null
                : this.props.participant.id));
    }

    /**
     * Handler for case when video starts to play.
     * @returns {void}
     */
    onVideoPlayingHandler() {
        this.props.dispatch(participantVideoStarted(this.props.participant.id));
    }

    /**
     * Returns audio and video media streams for participant.
     * @returns {{ video: (MediaStream|null), audio: (MediaStream|null) }}
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

    /**
     * React component render method.
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        let streams = this.getMediaStreams();

        return (
            <VideoThumbnailContainer
                focused={this.props.participant.focused}
                onClick={this.onClickHandler.bind(this)}>
                {streams.video && <Video
                    stream={streams.video}
                    onPlaying={this.onVideoPlayingHandler.bind(this)}/>}
                {streams.audio && <Audio
                    stream={streams.audio}/>}
            </VideoThumbnailContainer>
        );
    }
}

/**
 * React PropTypes for VideoThumbnail component.
 * @static
 */
VideoThumbnail.propTypes = {
    participant: React.PropTypes.object,
    audioTrack: React.PropTypes.object,
    videoTrack: React.PropTypes.object,
    dispatch: React.PropTypes.func
};

export default connect()(VideoThumbnail);