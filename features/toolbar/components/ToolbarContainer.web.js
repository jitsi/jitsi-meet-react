import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import { ColorPalette } from '../../base/styles';

import { styles } from './styles';

/**
 * The web container rendering the toolbar.
 */
export class ToolbarContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const underlayColor = ColorPalette.buttonUnderlay;
        let micButtonStyle;
        let micButtonIcon;

        if (this.props.audioMuted) {
            micButtonStyle = {
                ...styles.toolbarButton,
                backgroundColor: underlayColor
            };
            micButtonIcon = 'microphone-slash';
        } else {
            micButtonStyle = styles.toolbarButton;
            micButtonIcon = 'microphone';
        }

        return (
            <div style = { styles.toolbarContainer }>
                <button
                    style = { micButtonStyle }
                    onClick = { this.props.onAudioMute }>
                    <Icon name = { micButtonIcon } style = { styles.icon } />
                </button>
                <button
                    style = { {
                        ...styles.toolbarButton,
                        backgroundColor: ColorPalette.jitsiRed
                    } }
                    onClick= { this.props.onHangup }>
                    <Icon name = 'phone' style = { styles.icon } />
                </button>
                <button
                    style = { styles.toolbarButton }
                    onClick= { this.props.onCameraChange }>
                    <Icon name='camera' style = { styles.icon } />
                </button>
            </div>
        );
    }
}

/**
 * ToolbarContainer component's property types.
 *
 * @static
 */
ToolbarContainer.propTypes = {
    audioMuted: React.PropTypes.bool,
    onAudioMute: React.PropTypes.func,
    onCameraChange: React.PropTypes.func,
    onHangup: React.PropTypes.func
};
