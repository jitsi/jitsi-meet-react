import React, { Component } from 'react';

import ToolbarContainer from './native/ToolbarContainer';

import { connect } from 'react-redux';


// All those are needed for the connection with the store.
require('../polyfills/browserify');
const jQuery = require('jquery');
require('../polyfills/browser');
jQuery(window);
const Actions = require('../actions');


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
                onHangup = {() => {
                    this.props.onHangup();
                    this.props.navigator.pop();
                }}
                onCameraChange = {() => {this.props.onCameraChange()}}
            />
        );
    }
}

Toolbar.propTypes = {
    navigator: React.PropTypes.object
};

/**
 * Maps the audioState to component props.
 */
const mapStateToProps = state => {
    return {
        audioState: state.media.audioMuted
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
