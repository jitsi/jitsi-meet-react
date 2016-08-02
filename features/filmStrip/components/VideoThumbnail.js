import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Audio,
    MEDIA_TYPE,
    Video
} from '../../base/media';
import {
    PARTICIPANT_ROLE,
    pinParticipant
} from '../../base/participants';
import { trackVideoStarted } from '../../base/tracks';

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
        this.props.dispatch(
            trackVideoStarted(this.props.videoTrack.jitsiTrack));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let { audioTrack, largeVideo, participant, videoTrack } = this.props;
        let audioStream;
        let videoStream;

        // We don't render audio in any of the following:
        // 1. The audio (source) is muted. There's no practical reason (that we
        //    know of, anyway) why we'd want to render it given that it's
        //    silence (& not even comfort noise).
        // 2. The audio is local. If we were to render local audio, the local
        //    participants would be hearing themselves.
        if (audioTrack && !audioTrack.muted && !audioTrack.local) {
            audioStream = audioTrack.jitsiTrack.getOriginalStream();
        }

        // We don't render video (in the film strip) in any of the following:
        // 1. The video (source) is muted. Even if muted video happens to be
        //    black frames one day, we've decided to display the participant's
        //    avatar instead.
        // 2. The video is rendered on the stage i.e. as a large video.
        if (videoTrack 
            && !videoTrack.muted 
            && (!videoTrack.videoStarted
                || participant.id !== largeVideo.participantId)) {
            videoStream = videoTrack.jitsiTrack.getOriginalStream();
        }

        return (
            <VideoThumbnailContainer
                pinned={ participant.pinned }
                onClick={ this._onClick }>

                { audioStream &&
                    <Audio
                        stream={ audioStream } /> }

                { videoStream &&
                    <Video
                        mirror={ videoTrack.mirrorVideo }
                        onPlaying={ this._onVideoPlaying }
                        stream={ videoStream } /> }

                { !videoStream &&
                    <Avatar uri={ participant.avatar } /> }

                { participant.role === PARTICIPANT_ROLE.MODERATOR &&
                    <ModeratorIndicator /> }

                { participant.speaking &&
                    <DominantSpeakerIndicator /> }

                { (!audioTrack || audioTrack.muted) &&
                    <AudioMutedIndicator /> }

                { (!videoTrack || videoTrack.muted) &&
                    <VideoMutedIndicator /> }

            </VideoThumbnailContainer>
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @returns {{
 *      audioTrack: Track,
 *      largeVideo: Object,
 *      videoTrack: Track
 *  }}
 */
const mapStateToProps = (state, ownProps) => {
    // We need read-only access to the state of features/largeVideo so that
    // the film strip doesn't render the video of the participant who is
    // rendered on the stage i.e. as a large video.
    let largeVideo = state['features/largeVideo'];
    let tracks = state['features/base/tracks'];
    let participantId = ownProps.participant.id;
    let audioTrack = tracks.find(t => (
        t.mediaType === MEDIA_TYPE.AUDIO
            && participantId === t.participantId
    ));
    let videoTrack = tracks.find(t => (
        t.mediaType === MEDIA_TYPE.VIDEO
            && participantId === t.participantId
    ));
    return {
        audioTrack,
        largeVideo,
        videoTrack
    };
};

/**
 * VideoThumbnail component's property types.
 *
 * @static
 */
VideoThumbnail.propTypes = {
    audioTrack: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    largeVideo: React.PropTypes.object,
    participant: React.PropTypes.object,
    videoTrack: React.PropTypes.object
};

export default connect(mapStateToProps)(VideoThumbnail);
