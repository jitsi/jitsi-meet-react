import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Audio,
    shouldMirror,
    Video
} from '../../base/media';
import {
    PARTICIPANT_ROLE,
    participantVideoStarted,
    pinParticipant
} from '../../base/participants';

import {
    AudioMutedIndicator,
    Avatar,
    DominantSpeakerIndicator,
    ModeratorIndicator,
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
    handleVideoThumbClicked() {
        let { dispatch, participant } = this.props;

        // TODO: this currently ignores interfaceConfig.filmStripOnly
        dispatch(pinParticipant(
            participant.pinned
                ? null
                : participant.id));
    }

    /**
     *
     * Handles click/tap event on the thumbnail. Prevents further event
     * propagation.
     *
     * @param {Event} ev - DOM event.
     * @returns {false}
     */
    _onClick(ev) {
        this.handleVideoThumbClicked();

        // On IE we need to populate this handler on video <object> and it does
        // not give event instance as an argument, so we check here for methods.
        if (ev && ev.stopPropagation && ev.preventDefault) {
            ev.stopPropagation();
            ev.preventDefault();
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
        let participant = this.props.participant;
        let largeVideo = this.props.largeVideo;
        let streams = this.getMediaStreams();
        // We don't render audio in any of the following:
        // 1. The audio (source) is muted. There's no practical reason (that we
        //    know of, anyway) why we'd want to render it given that it's
        //    silence (& not even comfort noise).
        // 2. The audio is local. If we were to render local audio, the local
        //    participant would be hearing themselves.
        let renderAudio =
            streams.audio
                && !this.props.audioMuted
                && !this.props.audioTrack.isLocal();
        // We don't render video (in the film strip) in any of the following:
        // 1. The video (source) is muted. Even if muted video happens to be
        //    black frames one day, we've decided to display the participant's
        //    avatar instead.
        // 2. The video is rendered on the stage i.e. as a large video.
        let renderVideo =
            streams.video
                && !this.props.videoMuted
                && (!participant.videoStarted
                    || participant.id !== largeVideo.participantId);

        return (
            <VideoThumbnailContainer
                pinned={ participant.pinned }
                onClick={ this._onClick }>

                { renderAudio &&
                    <Audio stream={ streams.audio } /> }

                { renderVideo &&
                    <Video
                        mirror={ shouldMirror(this.props.videoTrack) }
                        onPlaying={ this._onVideoPlaying }
                        stream={ streams.video } /> }

                { !renderVideo &&
                    <Avatar uri={ participant.avatar } /> }

                { participant.role === PARTICIPANT_ROLE.MODERATOR &&
                    <ModeratorIndicator /> }

                { participant.speaking &&
                    <DominantSpeakerIndicator /> }

                { this.props.audioMuted &&
                    <AudioMutedIndicator /> }

                { this.props.videoMuted &&
                    <VideoMutedIndicator /> }

            </VideoThumbnailContainer>
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      largeVideo: Object
 *  }}
 */
const mapStateToProps = state => {
    return {
        // We need read-only access to the state of features/largeVideo so that
        // the film strip doesn't render the video of the participant who is
        // rendered on the stage i.e. as a large video.
        largeVideo: state['features/largeVideo']
    };
};

/**
 * VideoThumbnail component's property types.
 *
 * @static
 */
VideoThumbnail.propTypes = {
    audioMuted: React.PropTypes.bool,
    audioTrack: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    largeVideo: React.PropTypes.object,
    participant: React.PropTypes.object,
    videoMuted: React.PropTypes.bool,
    videoTrack: React.PropTypes.object
};

export default connect(mapStateToProps)(VideoThumbnail);
