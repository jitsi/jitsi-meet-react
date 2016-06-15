import React, { Component } from 'react';
import { RTCView } from 'react-native-webrtc';

import styles from './styles/VideoStyle';

/**
 * The video native container wrapping around the RTCView.
 */
class Video extends Component {
    render() {
        let streamUrl = this.props.stream ? this.props.stream.toURL() : '';

        return (
            <RTCView style = { styles.conference } streamURL={streamUrl}/>
        );
    }
}

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};

export default Video;
