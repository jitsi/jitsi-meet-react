import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MEDIA_TYPE, VideoTrack } from '../../base/media';
import { getParticipant } from '../../base/participants';
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
        const avatar = this.props.avatar;
        const videoTrack = this.props.videoTrack;
        const renderAvatar
            = typeof avatar !== 'undefined'
                && avatar !== ''
                && (!videoTrack
                    || (videoTrack
                        && (!videoTrack.videoStarted || videoTrack.muted)));

        return (
            <LargeVideoContainer>
                { renderAvatar
                    && <Avatar
                        additionalStyle = { styles.dominantSpeakerAvatar }
                        uri = { avatar } /> }

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
 *      avatar: string,
 *      videoTrack: Track
 * }}
 */
const mapStateToProps = state => {
    const participantId = state['features/largeVideo'].participantId;

    return {
        avatar: (getParticipant(
            state['features/base/participants'],
            participantId) || {}).avatar,
        videoTrack: getTrackByMediaTypeAndParticipant(
            state['features/base/tracks'],
            MEDIA_TYPE.VIDEO,
            participantId)
    };
};

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
