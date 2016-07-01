import React, { Component } from 'react';
import { RTCView } from 'react-native-webrtc';

import styles from './styles/Styles';

/**
 * The React Native component which is similar to Web's video element and wraps
 * around react-native-webrtc's RTCView.
 */
export class Video extends Component {
    /**
     * React Component method that executes once component is mounted.
     * @inheritdoc
     */
    componentDidMount() {
        // RTCView currently does not support media events, so just fire
        // onPlaying callback when <RTCView> is rendered.
        if (this.props.onPlaying) {
            this.props.onPlaying();
        }
    }

    /**
     * React Component render method.
     * @inheritdoc
     * @returns {*}
     */
    render() {
        let stream = this.props.stream;

        if (stream) {
            let streamURL = stream.toURL();

            return (
                <RTCView style={ styles.video } streamURL={ streamURL }/>
            );
        }

        // RTCView has peculiarities which may or may not be platform specific.
        // For example, it doesn't accept an empty streamURL. If the execution
        // reached here, it means that we explicitly chose to not initialize an
        // RTCView as a way of dealing with its idiosyncrasies.
        return null;
    }
}

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func
};
