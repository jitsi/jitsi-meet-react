import React from 'react';
import Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { MEDIA_TYPE } from '../../base/media';
import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { styles } from './styles';

/**
 * Implements the conference toolbar on Web.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const audioButtonStyles = this._getMuteButtonStyles(MEDIA_TYPE.AUDIO);
        const videoButtonStyles = this._getMuteButtonStyles(MEDIA_TYPE.VIDEO);

        return (
            <div style = { styles.toolbarContainer }>
                <div style = { styles.toolbarButtonsContainer }>
                    <button

                        // eslint-disable-next-line react/jsx-handler-names
                        onClick = { this._toggleAudio }
                        style = { audioButtonStyles.buttonStyle }>
                        <Icon
                            name = { audioButtonStyles.iconName }
                            style = { audioButtonStyles.iconStyle } />
                    </button>
                    <button
                        onClick = { this._onHangup }
                        style = {{
                            ...styles.toolbarButton,
                            backgroundColor: ColorPalette.jitsiRed
                        }}>
                        <Icon
                            name = 'phone'
                            style = { styles.icon } />
                    </button>
                    <button

                        // eslint-disable-next-line react/jsx-handler-names
                        onClick = { this._toggleVideo }
                        style = { videoButtonStyles.buttonStyle }>
                        <Icon
                            name = { videoButtonStyles.iconName }
                            style = { videoButtonStyles.iconStyle } />
                    </button>
                </div>
            </div>
        );
    }
}

/**
 * Additional properties for various icons, which are now platform-dependent.
 * This is done to have common logic of generating styles for web and native.
 * TODO As soon as we have common font sets for web and native, this will no
 * longer be required.
 */
Object.assign(Toolbar.prototype, {
    audioIcon: 'microphone',
    audioMutedIcon: 'microphone-slash',
    videoIcon: 'video-camera',

    // TODO Currently, for web version we're using default FontAwesome font set,
    // which doesn't have 'slashed' version of 'video-camera' icon. But this
    // should be changed as soon as we start to use custom Jitsi icons.
    videoMutedIcon: 'video-camera'
});

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
