import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Video } from '../../base/media';
import { participantSelected } from '../../base/participants';
import {
    MEDIA_TYPE,
    VIDEO_TYPE
} from '../../base/tracks';

import { LargeVideoContainer } from './LargeVideoContainer';

/**
 * Large video React component.
 *
 * @extends Component
 */
class LargeVideo extends Component {
    /**
     * Constructs new LargeVideo component.
     *
     * @param {Object} props - Component props.
     */
    constructor(props) {
        super(props);

        this.state = {
            activeParticipant: null,
            videoStream: null,
            videoTrack: null
        };
    }

    /**
     * How we handle new component properties.
     *
     * @inheritdoc
     * @param {Object} nextProps - New props that component will receive.
     */
    componentWillReceiveProps(nextProps) {
        let activeParticipant = getActiveParticipant(nextProps);
        let videoStream = null;
        let videoTrack = null;

        if (activeParticipant) {
            // If current active active participant is local user and he is
            // dominant speaker and not focused, use previous video stream.
            if (activeParticipant.local &&
                activeParticipant.speaking &&
                !activeParticipant.focused &&
                this.state.videoStream &&
                this.state.videoTrack) {
                videoStream = this.state.videoStream;
                videoTrack = this.state.videoTrack;
            } else {
                videoTrack = getVideoTrack(
                    activeParticipant, this.props.tracks);

                videoStream = videoTrack
                    ? videoTrack.jitsiTrack.getOriginalStream()
                    : this.state.videoStream;
            }
        }

        // If our active participant changed and we're going to show "camera" on
        // large video, dispatch respective event.
        if (activeParticipant &&
            !activeParticipant.selected &&
            videoTrack &&
            videoTrack.videoType === VIDEO_TYPE.CAMERA) {
            this.props.dispatch(participantSelected(activeParticipant.id));
        }

        this.setState({
            activeParticipant,
            videoStream,
            videoTrack
        });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let videoStream = this.state.videoStream;
        let videoTrack = this.state.videoTrack;

        // TODO: in future other stuff might be on large video.

        return (
            <LargeVideoContainer>{
                videoStream &&
                videoTrack &&
                videoTrack.videoStarted &&
                <Video
                    mirror={ videoTrack.mirrorVideo }
                    stream={ videoStream } />
            }</LargeVideoContainer>
        );
    }
}

/**
 * Returns active participant to show.
 *
 * @param {Object} props - Component props.
 * @returns {(Participant|undefined)}
 */
function getActiveParticipant(props) {
    // First get the focused participant.
    let participants = props.participants;
    let activeParticipant = participants.find(p => p.focused);

    // If no participant is focused, get the dominant speaker.
    if (!activeParticipant) {
        activeParticipant = participants.find(p => p.speaking);

        // If no participant is focused and no dominant speaker, just get the
        // last one participant.
        if (!activeParticipant) {
            activeParticipant = participants[participants.length - 1];
        }
    }

    return activeParticipant;
}

/**
 * Returns video stream for a specified participant.
 *
 * @param {Participant} participant - Participant object.
 * @param {Track[]} tracks - List of all Track object.
 * @returns {(Track|undefined)}
 */
function getVideoTrack(participant, tracks) {
    return tracks.find(t =>
        t.mediaType === MEDIA_TYPE.VIDEO && t.participantId === participant.id);
}

/**
 * Maps parts Redux state to Component's props.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      tracks: (JitsiLocalTrack|JitsiRemoteTrack)[],
 *      participants: Participant[]
 *  }}
 */
const mapStateToProps = state => {
    return {
        participants: state['features/base/participants'],
        tracks: state['features/base/tracks']
    };
};

/**
 * LargeVideo component's property types.
 *
 * @static
 */
LargeVideo.propTypes = {
    dispatch: React.PropTypes.func,
    participants: React.PropTypes.array,
    tracks: React.PropTypes.array
};

export default connect(mapStateToProps)(LargeVideo);
