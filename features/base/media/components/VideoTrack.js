import React, { Component } from  'react';
import  { connect } from 'react-redux';

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
        let track = this.props.videoTrack;

        return (
            <Video
                mirror={ track.mirrorVideo }
                onPlaying={ this._onVideoPlaying }
                stream={ track.jitsiTrack.getOriginalStream() }/>
        );
    }

    /**
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying() {
        let videoTrack = this.props.videoTrack;

        if (videoTrack) {
            this.props.dispatch(trackVideoStarted(videoTrack.jitsiTrack));
        }
    }
}

/**
 * Component's property types.
 * @type {{
 *      dispatch: Function,
 *      videoTrack: Track
 *  }}
 */
VideoTrack.propTypes = {
    dispatch: React.PropTypes.func,
    videoTrack: React.PropTypes.object.isRequired
};

export default connect()(VideoTrack);