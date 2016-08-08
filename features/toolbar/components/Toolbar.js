import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setRoom } from '../../base/conference';
import {
    toggleAudio,
    toggleCameraFacingMode
} from '../';

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
                onAudioMute = { this.props.onAudioMute }
                onCameraChange = { this.props.onCameraChange }
                onHangup = { this.props.onHangup }
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
    const stateFeaturesToolbar = state['features/toolbar'];

    return {
        audioMuted: stateFeaturesToolbar.audioMuted,
        videoMuted: stateFeaturesToolbar.videoMuted
    };
};

/**
 * Maps the onAudioMute, onCameraChange, and onHangup actions to component
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
            dispatch(toggleAudio());
        },
        onCameraChange() {
            dispatch(toggleCameraFacingMode());
        },
        onHangup() {
            // XXX We don't know here which value is effectively/internally used
            // when there's no valid room name to join. It isn't our business to
            // know that anyway. The undefined value is our expression of (1)
            // the lack of knowledge & (2) the desire to no longer have a valid
            // room name to join.
            dispatch(setRoom(undefined));
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
    onAudioMute: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    onHangup: React.PropTypes.func,
    videoMuted: React.PropTypes.bool,
    visible: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
