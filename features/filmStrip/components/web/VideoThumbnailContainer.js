import React, { Component } from 'react';
import { ColorPalette } from '../../../base/styles';

export class VideoThumbnailContainer extends Component {
    render() {
        let styles = {};

        // TODO: this is temporary solution, discuss UI
        if (this.props.pinned) {
            styles.border = "5px solid " + ColorPalette.jitsiBlue;
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
