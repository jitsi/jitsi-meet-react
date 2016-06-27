import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hangup, toggleAudio, toggleCameraFacingMode } from '../';
import { navigate } from '../../base/navigation';

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
                onAudioMute = { (muted) => {
                    this.props.onAudioMute(muted);
                } }
                onHangup = {() => {
                    this.props.onHangup(this.props.navigator);
                } }
                onCameraChange = {() => { this.props.onCameraChange() } }
                />
        );
    }
}

/**
 * Maps the audioMuted and videoMuted properties to component props.
 */
const mapStateToProps = state => {
    const stateFeaturesToolbar = state['features/toolbar'];
    return {
        audioMuted: stateFeaturesToolbar.audioMuted,
        videoMuted: stateFeaturesToolbar.videoMuted
    };
};

/**
 * Maps the onAudioMute, onHangup and onCameraChange actions to component
 * props.
 */
const mapDispatchToProps = dispatch => {
    return {
        onAudioMute: () => {
            dispatch(toggleAudio());
        },
        onHangup: (navigator) => {
            dispatch(hangup());
            dispatch(navigate({
                screen: 'home',
                navigator
            }));
        },
        onCameraChange: () => {
            dispatch(toggleCameraFacingMode())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
