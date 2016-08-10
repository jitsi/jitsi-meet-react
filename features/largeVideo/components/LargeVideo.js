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
        const videoTrack = this.props.videoTrack;

        return (
            <LargeVideoContainer>
                <VideoTrack
                    videoTrack = { videoTrack }
                    waitForVideoStarted = { true } />
            </LargeVideoContainer>
        );
    }
}

/**
 * Maps parts Redux state to Component's props.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      videoTrack: Track
 * }}
 */
const mapStateToProps = state => {
    const largeVideo = state['features/largeVideo'];
    const tracks = state['features/base/tracks'];

    return {
        videoTrack: getTrackByMediaTypeAndParticipant(
            tracks,
            MEDIA_TYPE.VIDEO,
            largeVideo.participantId)
    };
};

/**
 * LargeVideo component's property types.
 *
 * @static
 */
LargeVideo.propTypes = {
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object
};

export default connect(mapStateToProps)(LargeVideo);
