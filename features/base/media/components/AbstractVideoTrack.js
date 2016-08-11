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
     * Initializes a new AbstractVideoTrack instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            videoTrack: _falsy2null(props.videoTrack)
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Implements React's {@link Component#componentWillReceiveProps()}.
     *
     * @inheritdoc
     * @param {Object} nextProps - The read-only props which this Component will
     * receive.
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const oldValue = this.state.videoTrack;
        const newValue = _falsy2null(nextProps.videoTrack);

        if (oldValue !== newValue) {
            this._setVideoTrack(newValue);
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

    /**
     * Sets a specific video track to be rendered by this instance.
     *
     * @param {Track} videoTrack - The video track to be rendered by this
     * instance.
     * @protected
     * @returns {void}
     */
    _setVideoTrack(videoTrack) {
        this.setState({ videoTrack });
    }
}

/**
 * AbstractVideoTrack component's property types.
 *
 * @static
 */
AbstractVideoTrack.propTypes = {
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object,
    waitForVideoStarted: React.PropTypes.bool
};

/**
 * Returns null if a specific value is falsy; otherwise, returns the specified
 * value.
 *
 * @param {*} value - The value to return if it is not falsy.
 * @returns {*} If the specified value is falsy, null; otherwise, the specified
 * value.
 */
function _falsy2null(value) {
    return value || null;
}
