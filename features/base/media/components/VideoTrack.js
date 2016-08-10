import React, { Component } from 'react';
import { connect } from 'react-redux';

import { trackVideoStarted } from '../../tracks';

import { Video } from './_';

/**
 * Component that renders video element for a specified video track.
 */
class VideoTrack extends Component {
    /**
     * Initializes a new VideoTrack instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const videoTrack = this.props.videoTrack;
        let stream = null;

        if (videoTrack

                // XXX We may want not to start showing video until video stream
                // has started to play anywhere else.
                && (!this.props.waitForVideoStarted
                    || videoTrack.videoStarted)) {
            stream = videoTrack.jitsiTrack.getOriginalStream();
        }

        return (
            <Video
                mirror = { videoTrack && videoTrack.mirrorVideo }
                onPlaying = { this._onVideoPlaying }
                stream = { stream } />
        );
    }

    /**
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying() {
        const videoTrack = this.props.videoTrack;

        if (videoTrack && !videoTrack.videoStarted) {
            this.props.dispatch(trackVideoStarted(videoTrack.jitsiTrack));
        }
    }
}

/**
 * VideoTrack component's property types.
 *
 * @static
 */
VideoTrack.propTypes = {
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object,
    waitForVideoStarted: React.PropTypes.bool
};

export default connect()(VideoTrack);
