import React, { Component } from 'react';
const FontAwesomeIcon = require('react-fontawesome');

import { JITSI_ICONS } from '../../constants';
import './styles';

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
        if (JITSI_ICONS.has(name)) {
            const style = this.props.style;

            return (
                <span
                    className = { `icon-${name}` }
                    style = { style } />
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
