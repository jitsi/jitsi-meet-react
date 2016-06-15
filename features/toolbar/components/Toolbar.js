import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

import ToolbarContainer from './native/ToolbarContainer';

/**
 * The conference call toolbar.
 */
class Toolbar extends Component {
    render() {
        return (
            <ToolbarContainer
                audioMuted = { this.props.audioMuted }
                videoMuted = { this.props.videoMuted }
                onAudioMute = { (muted) => {
                    this.props.onAudioMute(muted);
                }}
                onHangup = {() => {
                    this.props.onHangup();
                    this.props.navigator.pop();
                }}
                onCameraChange = {() => {this.props.onCameraChange()}}
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
        onHangup: () => {
            dispatch(Actions.hangup());
        },
        onCameraChange: () => {
            dispatch(Actions.toggleCameraFacingMode())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
