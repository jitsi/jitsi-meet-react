import React, { Component } from 'react';

/**
 * Abstract (base) class for container of React Component children with a style.
 *
 * @extends Component
 */
export default class AbstractContainer extends Component {

    /**
     * Renders this AbstractContainer as a React Component of a specific type.
     *
     * @param {string|ReactClass} type - The type of the React Component which
     * is to be rendered.
     * @param {Object|undefined} props - The read-only React Component
     * properties, if any, to render. If undefined, the props of this instance
     * will be rendered.
     * @protected
     * @returns {ReactElement}
     */
    _render(type, props) {
        const {
            children,

            /* eslint-disable no-unused-vars */

            // The following properties are defined for the benefit of
            // AbstractContainer and its extenders so they are to not be
            // propagated.
            feedback,
            onPress,
            visible,

            /* eslint-enable no-unused-vars */

            ...filteredProps
        } = props || this.props;

        return React.createElement(type, filteredProps, children);
    }
}

/**
 * AbstractContainer component's property types.
 *
 * @static
 */
AbstractContainer.propTypes = {
    children: React.PropTypes.node,

    /**
     * True if this instance is to provide visual feedback when touched;
     * otherwise, false. If feedback is undefined and onPress is defined,
     * feedback is considered defined as true.
     */
    feedback: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    style: React.PropTypes.object,
    visible: React.PropTypes.bool
};
