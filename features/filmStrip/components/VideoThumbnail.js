import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Audio, Video } from '../../base/media';
import {
    participantFocused,
    participantVideoStarted
} from '../../base/participants';
import { pinParticipant } from '../../conference';

import { VideoThumbnailContainer } from './_';

/**
 * React component for video thumbnail.
 * @extends Component
 */
class VideoThumbnail extends Component {
    /**
     * Initializes new Video Thumbnail component.
     *
     * @param {Object} props - Component props.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onClick = this._onClick.bind(this);
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Returns audio and video media streams for participant.
     *
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
     * Processes click on video thumbnail.
     *
     * @returns {void}
     */
    handleVideoThumbClicked () {
        // TODO: this currently ignores interfaceConfig.filmStripOnly
        this.props.dispatch(participantFocused(
            this.props.participant.focused
                ? null
                : this.props.participant.id));

        this.props.dispatch(pinParticipant(
            this.props.participant.pinned
                ? null
                : this.props.participant.id));
    }

    /**
     *
     * Handles click/tap event on the thumbnail. Prevents further event
     * propagation.
     *
     * @param {Event} event - DOM event.
     * @returns {false}
     */
    _onClick(event) {
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
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying() {
        this.props.dispatch(participantVideoStarted(this.props.participant.id));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let streams = this.getMediaStreams();

        return (
            <VideoThumbnailContainer
                focused={this.props.participant.focused}
                onClick={this._onClick}>
                {streams.video && <Video
                    stream={streams.video}
                    onPlaying={this._onVideoPlaying}/>}
                {streams.audio && <Audio
                    stream={streams.audio}/>}
            </VideoThumbnailContainer>
        );
    }
}

/**
 * VideoThumbnail component's property types.
 *
 * @static
 */
VideoThumbnail.propTypes = {
    audioTrack: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    participant: React.PropTypes.object,
    videoTrack: React.PropTypes.object
};

export default connect()(VideoThumbnail);
