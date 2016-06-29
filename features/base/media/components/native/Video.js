import React, { Component } from 'react';
import { RTCView } from 'react-native-webrtc';

import styles from './styles/Styles';

/**
 * The video native container wrapping around the RTCView.
 */
export class Video extends Component {
    componentDidMount() {
        // RTCView currently does not support media events, so just fire
        // onPlaying callback when <RTCView> is rendered.
        if (this.props.onPlaying) {
            this.props.onPlaying();
        }
    }

    render() {
        let streamUrl = this.props.stream ? this.props.stream.toURL() : '';

        return (
            <RTCView style = { styles.video } streamURL={streamUrl}/>
        );
    }
}

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func
};
