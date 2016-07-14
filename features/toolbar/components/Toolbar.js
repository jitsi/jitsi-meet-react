import React, { Component } from 'react';
import { connect } from 'react-redux';

import { destroy } from '../../base/connection';
import { navigate } from '../../base/navigation';

import {
    toggleAudio,
    toggleCameraFacingMode
} from '../';
import { ToolbarContainer } from './_';

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
                onHangup = { () => this.props.onHangup(this.props.navigator) }
                onCameraChange = { () => this.props.onCameraChange() }
                videoMuted = { this.props.videoMuted }
                />
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
    const stateFeaturesToolbar = state['features/toolbar'];
    return {
        audioMuted: stateFeaturesToolbar.audioMuted,
        videoMuted: stateFeaturesToolbar.videoMuted
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
        onAudioMute: () => {
            dispatch(toggleAudio());
        },
        onCameraChange: () => {
            dispatch(toggleCameraFacingMode());
        },
        onHangup: navigator => {
            dispatch(destroy())
                .then(() => dispatch(navigate({ screen: 'home', navigator })));
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
    videoMuted: React.PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
