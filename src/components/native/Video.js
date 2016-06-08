import { RTCView } from 'react-native-webrtc';
import React, { Component } from 'react';

class Video extends Component {
    render() {
        let streamUrl = this.props.stream ? this.props.stream.toURL() : '';

        return (
            <RTCView style={{ alignSelf: 'stretch', flex: 1 }} streamURL={streamUrl}/>
        );
    }
}

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};

export default Video;