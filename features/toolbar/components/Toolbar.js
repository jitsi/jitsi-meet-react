import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    toggleCameraFacingMode,
    toggleMicrophoneMuted
} from '../../base/media';
import { navigate } from '../../base/navigation';

import { hangup } from '../';
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
                microphoneMuted = { this.props.microphoneMuted }
                cameraMuted = { this.props.cameraMuted }
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
 * @param {Object} state - Redux state.
 * @returns {{ audioMuted: boolean, videoMuted: boolean }}
 */
const mapStateToProps = state => {
    const stateFeaturesMedia = state['features/base/media'];
    return {
        microphoneMuted: stateFeaturesMedia.microphone.muted,
        cameraMuted: stateFeaturesMedia.camera.muted
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
            dispatch(toggleMicrophoneMuted());
        },
        onHangup: (navigator) => {
            dispatch(hangup())
                .then(() => dispatch(navigate({ screen: 'home', navigator })));
        },
        onCameraChange: () => {
            dispatch(toggleCameraFacingMode());
        }
    };
};

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = {
    onAudioMute: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    microphoneMuted: React.PropTypes.bool,
    cameraMuted: React.PropTypes.bool,
    navigator: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
