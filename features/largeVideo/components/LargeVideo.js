import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    MEDIA_TYPE,
    shouldRenderVideoTrack,
    VideoTrack
} from '../../base/media';
import { getParticipantById } from '../../base/participants';
import { getTrackByMediaTypeAndParticipant } from '../../base/tracks';
import { Avatar } from '../../conference';

import { LargeVideoContainer } from './LargeVideoContainer';
import { styles } from './styles';

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
        const { avatar, videoTrack } = this.props;

        // FIXME It's currently impossible to have true as the value of
        // waitForVideoStarted because videoTrack's state videoStarted will be
        // updated only after videoTrack is rendered.
        const waitForVideoStarted = false;
        const renderAvatar
            = typeof avatar !== 'undefined'
                && avatar !== ''
                && !shouldRenderVideoTrack(videoTrack, waitForVideoStarted);
        const renderVideo = !renderAvatar;

        return (
            <LargeVideoContainer>
                { renderVideo
                    && <VideoTrack
                        videoTrack = { videoTrack }
                        waitForVideoStarted = { waitForVideoStarted } /> }

                { renderAvatar
                    && <Avatar
                        style = { styles.avatar }
                        uri = { avatar } /> }
            </LargeVideoContainer>
        );
    }
}

/**
 * Maps parts Redux state to Component's props.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      avatar: string,
 *      videoTrack: Track
 * }}
 */
function mapStateToProps(state) {
    const participantId = state['features/largeVideo'].participantId;
    const participant
        = getParticipantById(
            state['features/base/participants'],
            participantId);

    return {
        avatar: participant ? participant.avatar : undefined,
        videoTrack:
            getTrackByMediaTypeAndParticipant(
                state['features/base/tracks'],
                MEDIA_TYPE.VIDEO,
                participantId)
    };
}

/**
 * LargeVideo component's property types.
 *
 * @static
 */
LargeVideo.propTypes = {
    avatar: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object
};

export default connect(mapStateToProps)(LargeVideo);
