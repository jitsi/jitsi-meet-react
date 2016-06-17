import React, { Component } from 'react';

export class Video extends Component {
    render() {
        // TODO: use URL.releaseObjectURL on componentDid/WillUnmount
        let src = this.props.stream
            ? URL.createObjectURL(this.props.stream)
            : '';

        return (
            <video autoPlay
                muted={this.props.muted}
                src={src}
            ></video>
        );
    }
}

Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};
