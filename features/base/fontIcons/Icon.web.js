import React, { Component } from 'react';
const FontAwesomeIcon = require('react-fontawesome');

import { JITSI_ICONS } from './constants';

const DEFAULT_COLOR = 'white';
const DEFAULT_SIZE = 14;

/**
 * Class for rendering icon from Ico Moon Jitsi-specific icon set or from Font
 * Awesome icon set.
 *
 * @extends Component
 */
export class Icon extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const name = this.props.name;

        // Jitsi icons have priority over FontAwesome icons.
        if (name in JITSI_ICONS) {
            const style = this.props.style;
            const color = style && style.color
                ? style.color
                : DEFAULT_COLOR;
            const size = style && style.fontSize
                ? style.fontSize
                : DEFAULT_SIZE;
            const wrapperStyle = Object.assign({
                display: 'inline-block',
                height: `${size}px`
            }, style);

            return (
                <span style = { wrapperStyle }>
                    <svg
                        height = { size }
                        viewBox = '0 0 1024 1024'
                        width = { size }>
                        <path
                            d = { JITSI_ICONS[name] }
                            fill = { color } />
                    </svg>
                </span>
            );
        }

        return (
            <FontAwesomeIcon { ...this.props } />
        );
    }
}

/**
 * Component's property types.
 *
 * @static
 */
Icon.propTypes = {
    name: React.PropTypes.string.isRequired,
    style: React.PropTypes.object
};
