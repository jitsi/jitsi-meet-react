import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Audio,
    MEDIA_TYPE,
    VideoTrack
} from '../../base/media';
import {
    PARTICIPANT_ROLE,
    pinParticipant
} from '../../base/participants';
import { getTrackByMediaTypeAndParticipant } from '../../base/tracks';

import {
    Avatar,
    DominantSpeakerIndicator,
    VideoThumbnailContainer
} from './_';

import { AudioMutedIndicator } from './AudioMutedIndicator';
import { ModeratorIndicator } from './ModeratorIndicator';
import { VideoMutedIndicator } from './VideoMutedIndicator';

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
    }

    /**
     * Processes click on video thumbnail.
     *
     * @returns {void}
     */
    handleVideoThumbClicked() {
        const { dispatch, participant } = this.props;

        // TODO The following currently ignores interfaceConfig.filmStripOnly.
        dispatch(pinParticipant(participant.pinned ? null : participant.id));
    }

    /**
     *
     * Handles click/tap event on the thumbnail. Prevents further event
     * propagation.
     *
     * @param {Event} ev - DOM event.
     * @returns {boolean}
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
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { audioTrack, largeVideo, participant, videoTrack } = this.props;

        // We don't render audio in any of the following:
        // 1. The audio (source) is muted. There's no practical reason (that we
        //    know of, anyway) why we'd want to render it given that it's
        //    silence (& not even comfort noise).
        // 2. The audio is local. If we were to render local audio, the local
        //    participants would be hearing themselves.
        const audioMuted = !audioTrack || audioTrack.muted;
        const renderAudio = !audioMuted && !audioTrack.local;

        // We don't render video (in the film strip) in any of the following:
        // 1. The video (source) is muted. Even if muted video happens to be
        //    black frames one day, we've decided to display the participant's
        //    avatar instead.
        // 2. The video is rendered on the stage i.e. as a large video.
        const videoMuted = !videoTrack || videoTrack.muted;
        const renderVideo
            = !videoMuted
                && (!videoTrack.videoStarted
                    || participant.id !== largeVideo.participantId);

        return (
            <VideoThumbnailContainer
                onClick = { this._onClick }
                pinned = { participant.pinned }>

                { renderAudio
                    && <Audio
                        stream
                            = { audioTrack.jitsiTrack.getOriginalStream() } /> }

                { renderVideo
                    && <VideoTrack videoTrack = { videoTrack } /> }

                { !renderVideo
                    && <Avatar uri = { participant.avatar } /> }

                { participant.role === PARTICIPANT_ROLE.MODERATOR
                    && <ModeratorIndicator /> }

                { participant.speaking
                    && <DominantSpeakerIndicator /> }

                { audioMuted
                    && <AudioMutedIndicator /> }

                { videoMuted
                    && <VideoMutedIndicator /> }

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
    // We need read-only access to the state of features/largeVideo so that the
    // film strip doesn't render the video of the participant who is rendered on
    // the stage i.e. as a large video.
    const largeVideo = state['features/largeVideo'];
    const tracks = state['features/base/tracks'];
    const id = ownProps.participant.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);
    const videoTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.VIDEO, id);

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
