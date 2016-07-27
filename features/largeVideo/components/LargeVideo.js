import React, { Component } from 'react';
import { connect } from 'react-redux';

import { shouldMirror, Video } from '../../base/media';
import { getVideoTrack } from '../../base/tracks';

import { LargeVideoContainer } from './LargeVideoContainer';

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
        let participant =
            this.props.participants.find(
                p => p.id === this.props.largeVideo.participantId);
        let videoTrack;

        // TODO: in future other stuff might be on large video.

        return (
            <LargeVideoContainer>
            {
                participant &&
                participant.videoStarted &&
                (videoTrack = getVideoTrack(participant, this.props.tracks)) &&
                <Video
                    mirror={ shouldMirror(videoTrack) }
                    stream={ videoTrack.getOriginalStream() }/>
            }
            </LargeVideoContainer>
        );
    }
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
    largeVideo: React.PropTypes.object,
    participants: React.PropTypes.array,
    tracks: React.PropTypes.array
};

export default connect(mapStateToProps)(LargeVideo);
