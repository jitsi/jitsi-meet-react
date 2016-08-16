import React from 'react';
import { connect } from 'react-redux';

import { Icon } from '../../base/fontIcons';
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
                            name = { AbstractToolbar.icons.hangupIcon }
                            style = { styles.whiteIcon } />
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
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);
