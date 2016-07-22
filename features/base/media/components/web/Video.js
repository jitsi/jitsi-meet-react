import React, { Component } from 'react';

import { styles } from './styles';

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
        // TODO URL.releaseObjectURL on componentDid/WillUnmount
        let src = this.props.stream
            ? URL.createObjectURL(this.props.stream)
            : '';
        let style = this.props.mirror
            ? styles.mirroredVideo
            : styles.video;

        return (
            <video
                autoPlay
                muted={ this.props.muted }
                onPlaying={ this.props.onPlaying }
                src={ src }
                style={ style }
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
    mirror: React.PropTypes.bool,
    muted: React.PropTypes.bool,
    onPlaying: React.PropTypes.func,
    stream: React.PropTypes.object
};
