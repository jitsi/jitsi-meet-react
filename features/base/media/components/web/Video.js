import React, { Component } from 'react';

/**
 * Web version of Audio component.
 * @extends Component
 */
export class Video extends Component {
    /**
     * Implements shouldComponentUpdate of React Component. We don't update
     * component if stream has not changed.
     *
     * @inheritdoc
     * @param {Object} nextProps - Props that component is going to receive.
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps) {
        return (nextProps.stream || {}).id !== (this.props.stream || {}).id;
    }

    /**
     * Implements React Component's render method.
     * 
     * @inheritdoc
     * @returns {XML} - JSX markup.
     */
    render() {
        // TODO: use URL.releaseObjectURL on componentDid/WillUnmount
        let src = this.props.stream
            ? URL.createObjectURL(this.props.stream)
            : '';

        return (
            <video autoPlay
                onPlaying={this.props.onPlaying}
                muted={this.props.muted}
                src={src}
            ></video>
        );
    }
}

/**
 * PropTypes for component.
 */
Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func
};
