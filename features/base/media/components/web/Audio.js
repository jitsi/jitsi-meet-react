import React, { Component } from 'react';

/**
 * React-Native version of Audio component.
 * @extends Component
 */
export class Audio extends Component {
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
            <audio autoPlay
                muted={this.props.muted}
                src={src}
            ></audio>
        );
    }
}

/**
 * PropTypes for component.
 */
Audio.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool
};
