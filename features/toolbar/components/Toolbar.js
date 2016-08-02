import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from '../../base/navigator';
import { WelcomePage } from '../../welcome';
import {
    toggleMicrophoneMuted,
    toggleCameraFacingMode
} from '../../base/media';

import { ToolbarContainer } from './ToolbarContainer';

/**
 * The conference call toolbar.
 */
class Toolbar extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ToolbarContainer
                audioMuted = { this.props.audioMuted }
                onAudioMute = { muted => this.props.onAudioMute(muted) }
                onCameraChange = { this.props.onCameraChange }
                onHangup = { () => this.props.onHangup(this.props.navigator) }
                videoMuted = { this.props.videoMuted }
                visible = { this.props.visible } />
        );
    }
}

/**
 * Maps the audioMuted and videoMuted properties to component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{ audioMuted: boolean, videoMuted: boolean }}
 */
const mapStateToProps = state => {
    const stateFeaturesMedia = state['features/base/media'];
    return {
        audioMuted: stateFeaturesMedia.microphone.muted,
        videoMuted: stateFeaturesMedia.camera.muted
    };
};

/**
 * Maps the onAudioMute, onHangup and onCameraChange actions to component
 * props.
 *
 * @param {Function} dispatch - Redux dispatch function.
 * @returns {{
 *      onAudioMute: Function,
 *      onHangup: Function,
 *      onCameraChange: Function
 *  }}
 */
const mapDispatchToProps = dispatch => {
    return {
        onAudioMute() {
            dispatch(toggleMicrophoneMuted());
        },
        onCameraChange() {
            dispatch(toggleCameraFacingMode());
        },
        onHangup(navigator) {
            dispatch(navigate({ component: WelcomePage, navigator }));
        }
    };
};

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = {
    audioMuted: React.PropTypes.bool,
    navigator: React.PropTypes.object,
    onAudioMute: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    videoMuted: React.PropTypes.bool,
    visible: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
