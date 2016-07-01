import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from '../../base/navigation';

import {
    hangup,
    toggleAudio,
    toggleCameraFacingMode
} from '../';
import { ToolbarContainer } from './_';

/**
 * The conference call toolbar.
 */
class Toolbar extends Component {
    /**
     * Implements React Component's render method.
     * @inheritdoc
     * @returns {XML}
     */
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
 *
 * @param {Object} state
 * @returns {{ audioMuted: boolean, videoMuted: boolean }}
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
 * @param {Function} dispatch
 * @returns {{
 *      onAudioMute: Function,
 *      onHangup: Function,
 *      onCameraChange: Function
 *  }}
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
            dispatch(toggleCameraFacingMode());
        }
    };
};

/**
 * Prop types for component.
 */
Toolbar.propTypes = {
    onAudioMute: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    audioMuted: React.PropTypes.bool,
    videoMuted: React.PropTypes.bool,
    navigator: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
