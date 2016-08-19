import React, { Component } from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
const FontAwesomeIcon = require('react-native-vector-icons/FontAwesome');

import { JITSI_ICONS } from '../constants';
import icoMoonConfig from './fonts/selection.json';

/**
 * Creates the Jitsi icon set from the ico moon project config file.
 */
const JitsiIcon = createIconSetFromIcoMoon(icoMoonConfig);

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
        /* eslint-disable react/jsx-no-bind, no-return-assign */

        // Jitsi icons have priority over FontAwesome icons.
        if (JITSI_ICONS.has(this.props.name)) {
            return (
                <JitsiIcon
                    { ...this.props }
                    ref = { component => this._root = component } />
            );
        }

        return (
            <FontAwesomeIcon
                { ...this.props }
                ref = { component => this._root = component } />
        );

        /* eslint-enable react/jsx-no-bind, no-return-assign */
    }

    /* eslint-disable jsdoc/check-tag-names, max-len */
    /**
     * We're wrapping native components with additional React component, so we
     * need to pass native props to native components.
     *
     * @link https://facebook.github.io/react-native/docs/direct-manipulation.html#forward-setnativeprops-to-a-child
     * @param {Object} nativeProps - Props passed to React-Native component.
     * @returns {void}
     */
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }

    /* eslint-enable jsdoc/check-tag-names, max-len */
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
