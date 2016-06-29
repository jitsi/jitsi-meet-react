import React, { Component } from 'react';

export class Video extends Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.stream || {}).id !== (this.props.stream || {}).id;
    }

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

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func
};
