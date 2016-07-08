import React, { Component } from 'react';

import styles from './styles/Styles';

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
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // TODO: use URL.releaseObjectURL on componentDid/WillUnmount
        let src = this.props.stream
            ? URL.createObjectURL(this.props.stream)
            : '';

        return (
            <video
                autoPlay
                muted={ this.props.muted }
                onPlaying={ this.props.onPlaying }
                src={ src }
                style={ styles.video }
            />
        );
    }
}

/**
 * Video component's property types.
 *
 * @static
 */
Video.propTypes = {
    stream: React.PropTypes.object,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func
};
