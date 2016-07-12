import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Video } from '../../base/media';

import { LargeVideoContainer } from './_';

/**
 * Large video React component.
 *
 * @extends Component
 */
class LargeVideo extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let participantOnStage = this.props.participants
            .find(p => p.id === this.props.largeVideo.onStageParticipantId);
        let videoTrack = participantOnStage
            ? getVideoTrack(participantOnStage, this.props.tracks)
            : null;

        // TODO: in future other stuff might be on large video.

        return (
            <LargeVideoContainer>
                { participantOnStage &&
                participantOnStage.videoStarted &&
                videoTrack &&
                <Video
                    stream={ videoTrack.getOriginalStream() }/> }
            </LargeVideoContainer>
        );
    }
}

/**
 * Returns video stream for a specified participant.
 *
 * @param {Participant} participant - Participant object.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - List of all tracks.
 * @returns {(JitsiLocalTrack|JitsiRemoteTrack|undefined)}
 */
function getVideoTrack(participant, tracks) {
    return tracks.find(t => {
        return t.isVideoTrack() &&
            ((participant.local && t.isLocal()) ||
            (!participant.local && !t.isLocal() &&
            t.getParticipantId() === participant.id));
    });
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
        largeVideo: state['features/largeVideo'],
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
    largeVideo: React.PropTypes.object,
    tracks: React.PropTypes.array
};

export default connect(mapStateToProps)(LargeVideo);
