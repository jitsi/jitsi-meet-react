import React, { Component } from 'react';

import { trackVideoStarted } from '../../tracks';

import { Video } from './_';

/**
 * Component that renders video element for a specified video track.
 *
 * @abstract
 */
export class AbstractVideoTrack extends Component {
    /**
     * Initializes a new VideoTrack instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        this.state = {
            videoTrack: props.videoTrack
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Implements React's {@link Component#componentWillReceiveProps()}.
     *
     * @inheritdoc
     * @param {Object} nextProps - New props component is receiving.
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const state = this.state;
        const nextVideoTrack = nextProps.videoTrack;

        if (!state.videoTrack
            || (nextVideoTrack
                && state.videoTrack !== nextVideoTrack)) {
            this._changeVideoTrack(nextVideoTrack);
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const videoTrack = this.state.videoTrack;
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
     * Changes the current video track.
     *
     * @protected
     * @param {Track} videoTrack - New video track to show.
     * @returns {void}
     */
    _changeVideoTrack(videoTrack) {
        this.setState({ videoTrack });
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
AbstractVideoTrack.propTypes = {
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object,
    waitForVideoStarted: React.PropTypes.bool
};
