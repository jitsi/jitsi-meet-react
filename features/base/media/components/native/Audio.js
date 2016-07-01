import React, { Component } from 'react';

/**
 * The React Native component which is similar to Web's audio element and wraps
 * around react-native-webrtc's RTCView.
 */
export class Audio extends Component {
    /**
     * Implements React Component's render method.
     * @inheritdoc
     * @returns {null}
     */
    render() {
        // TODO react-native-webrtc's RTCView doesn't do anything with the audio
        // MediaStream specified to it so it's easier at the time of this
        // writing to not render anything.
        return null;
    }
}

/**
 * Component's prop types.
 */
Audio.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};
