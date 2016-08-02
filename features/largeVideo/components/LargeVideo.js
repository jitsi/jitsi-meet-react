import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MEDIA_TYPE, Video } from '../../base/media';

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
        let videoTrack = this.props.tracks.find(
            t => (
                t.participantId === this.props.largeVideo.participantId
                && t.mediaType === MEDIA_TYPE.VIDEO
            )
        );

        // TODO: in future other stuff might be on large video.

        return (
            <LargeVideoContainer>
            {
                videoTrack &&
                videoTrack.videoStarted &&
                <Video
                    mirror={ videoTrack.mirrorVideo }
                    stream={ videoTrack.jitsiTrack.getOriginalStream() }/>
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
