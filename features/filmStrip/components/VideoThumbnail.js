import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    PARTICIPANT_ROLE,
    participantFocused,
    participantPinned,
    participantVideoStarted
} from '../../base/participants';

import {
    Audio,
    Video
} from '../../base/media';

import {
    AudioMutedIndicator,
    DominantSpeakerIndicator,
    ModeratorIndicator,
    ParticipantName,
    VideoMutedIndicator,
    VideoThumbnailContainer
} from './_';


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

        this.props.dispatch(participantPinned(
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

                {streams.audio &&
                    <Audio stream={streams.audio}/>}

                {streams.video && !this.props.videoMuted &&
                    <Video
                        stream={streams.video}
                        onPlaying={this._onVideoPlaying}/>}

                {this.props.participant.role === PARTICIPANT_ROLE.MODERATOR &&
                    <ModeratorIndicator />}

                {this.props.participant.speaking &&
                    <DominantSpeakerIndicator />}

                {this.props.audioMuted &&
                    <AudioMutedIndicator />}

                {this.props.videoMuted &&
                    <VideoMutedIndicator />}

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
    audioMuted: React.PropTypes.bool,
    audioTrack: React.PropTypes.object,
    participant: React.PropTypes.object,
    videoMuted: React.PropTypes.bool,
    videoTrack: React.PropTypes.object
};


export default connect()(VideoThumbnail);

