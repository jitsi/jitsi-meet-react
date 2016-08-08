import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MEDIA_TYPE, VideoTrack } from '../../base/media';
import { getTrackByMediaTypeAndParticipant } from '../../base/tracks';

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
        const { largeVideo, tracks } = this.props;
        const videoTrack
            = getTrackByMediaTypeAndParticipant(
                tracks,
                MEDIA_TYPE.VIDEO,
                largeVideo.participantId);

        return (
            <LargeVideoContainer>
            { videoTrack
                    && videoTrack.videoStarted
                    && <VideoTrack videoTrack = { videoTrack } /> }
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
    tracks: React.PropTypes.array
};

export default connect(mapStateToProps)(LargeVideo);
