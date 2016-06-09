import React, { Component } from 'react';

import ToolbarContainer from './native/ToolbarContainer';

import { connect } from 'react-redux';

// All those are needed for the connection with the store.
require('../polyfills/browserify');
const jQuery = require('jquery');
require('../polyfills/browser');
jQuery(window);
const Jitsi = require('../jitsi');

/**
 * The conference call toolbar.
 */
class Toolbar extends Component {
    render() {
        return (
            <ToolbarContainer
                onAudioMute = { (muted) => {
                    this.props.onAudioMute(muted);
                }}
                onHangup = {() => {this.props.onHangup()}}
                onCameraChange = {() => {this.props.onCameraChange()}}
            />
        );
    }
}

/**
 * Maps the audioState to component props.
 */
const mapStateToProps = state => {
    return {
        audioState: state.jitsi.muteStates.audioMuted
    };
}

/**
 * Maps the onAudioMute, onHangup and onCameraChange actions to component
 * props.
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onAudioMute: () => {
            dispatch(Jitsi.toggleAudio())
        },
        onHangup: () => {
            // dispatch(actions.hangup())
        },
        onCameraChange: () => {
            // dispatch(actions.cameraChange())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
