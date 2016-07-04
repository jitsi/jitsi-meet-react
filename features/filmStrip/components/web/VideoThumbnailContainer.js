import React, { Component } from 'react';

import { ColorPalette } from '../../../base/styles';

/**
 * The video thumbnail web container.
 */
export class VideoThumbnailContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let styles = {};

        // TODO: this is temporary solution, discuss UI
        if (this.props.focused) {
            styles.border = '5px solid ' + ColorPalette.jitsiBlue;
            /*
             .videoContainerFocused
             cursor: hand;
             transition-duration: .5s;
             -webkit-transition-duration: .5s;
             -webkit-animation-name: greyPulse;
             -webkit-animation-duration: 2s;
             -webkit-animation-iteration-count: 1;
             overflow: visible!important;
             box-shadow: inset 0 0 28px #006d91;
             border: 1px solid #006d91;
             */
        }

        return (
          <div style = {styles}
              onClick={this.props.onClick}>
              {this.props.children}
          </div>
        );
    }
}

/**
 * VideoThumbnailContainer component's property types.
 *
 * @static
 */
VideoThumbnailContainer.propTypes = {
    onClick: React.PropTypes.func,
    focused: React.PropTypes.bool,
    children: React.PropTypes.node
};
