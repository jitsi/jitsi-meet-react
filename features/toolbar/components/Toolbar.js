import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

import { ToolbarContainer } from './_';


/**
 * The conference call toolbar.
 */
class Toolbar extends Component {
    render() {
        return (
            <ToolbarContainer
                audioMuted = { this.props.audioMuted }
                videoMuted = { this.props.videoMuted }
                onAudioMute = { muted => this.props.onAudioMute(muted) }
                onHangup = { () => this.props.onHangup(this.props.navigator) }
                onCameraChange = { () => this.props.onCameraChange() }
                />
        );
    }
}

/**
 * Maps the audioMuted and videoMuted properties to component props.
 */
const mapStateToProps = state => {
    return {
        audioMuted: state.media.audioMuted,
        videoMuted: state.media.videoMuted
    };
};

/**
 * Maps the onAudioMute, onHangup and onCameraChange actions to component
 * props.
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onAudioMute: () => {
            dispatch(Actions.toggleAudio());
        },
        onHangup: (navigator) => {
            dispatch(Actions.hangup());
            dispatch(Actions.navigate({
                screen: 'home',
                navigator
            }));
        },
        onCameraChange: () => {
            dispatch(Actions.toggleCameraFacingMode());
        }
    };
};

Toolbar.propTypes = {
    onAudioMute: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    audioMuted: React.PropTypes.bool,
    videoMuted: React.PropTypes.bool,
    navigator: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);