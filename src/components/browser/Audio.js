import React, { Component } from 'react';

class Audio extends Component {
    render() {
        // TODO: use URL.releaseObjectURL on componentDid/WillUnmount
        let src = this.props.stream
            ? URL.createObjectURL(this.props.stream)
            : '';

        return (
            <audio autoPlay
                muted={this.props.muted}
                src={src}
            ></audio>
        );
    }
}

Audio.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};

export default Audio;
