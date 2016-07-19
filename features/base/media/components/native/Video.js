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
     *
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
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        let stream = this.props.stream;

        if (stream) {
            let streamURL = stream.toURL();

            // XXX The CSS style object-fit that we utilize on Web is not
            // supported on React Native. Adding objectFit to React Native's
            // StyleSheet appears to be impossible without hacking and an
            // unjustified amount of effort. Consequently, I've chosen to define
            // objectFit on RTCView itself. Anyway, prepare to accommodate a
            // future definition of objectFit in React Native's StyleSheet.
            let style = styles.video;
            let objectFit = (style && style.objectFit) || 'cover';

            return (
                <RTCView
                    accessibilityLabel="base.media.components.video"
                    objectFit={ objectFit }
                    streamURL={ streamURL }
                    style={ style }
                />
            );
        }

        // RTCView has peculiarities which may or may not be platform specific.
        // For example, it doesn't accept an empty streamURL. If the execution
        // reached here, it means that we explicitly chose to not initialize an
        // RTCView as a way of dealing with its idiosyncrasies.
        return null;
    }
}

/**
 * Video component's property types.
 *
 * @static
 */
Video.propTypes = {
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func,
    stream: React.PropTypes.object
};
