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
        return (
            <LargeVideoContainer>
                <VideoTrack
                    videoTrack = { this.props.videoTrack }
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
const mapStateToProps = state => ({ // eslint-disable-line arrow-body-style
    videoTrack:
        getTrackByMediaTypeAndParticipant(
            state['features/base/tracks'],
            MEDIA_TYPE.VIDEO,
            state['features/largeVideo'].participantId)
});

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
