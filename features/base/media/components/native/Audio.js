import React, { Component } from 'react';
import { RTCView } from 'react-native-webrtc';

export class Audio extends Component {
    render() {
        let streamUrl = this.props.stream ? this.props.stream.toURL() : '';

        return (
            <RTCView streamURL={streamUrl}/>
        );
    }
}

Audio.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};
