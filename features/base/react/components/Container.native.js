import React from 'react';
import {
    Dimensions,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import AbstractContainer from './AbstractContainer';

/**
 * Represents a container of React Native Component children with a style.
 *
 * @extends AbstractContainer
 */
export class Container extends AbstractContainer {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // eslint-disable-next-line prefer-const
        let { feedback, onPress, style, visible, ...props } = this.props;

        // visible

        // The following property is responsible to hide/show this Container by
        // moving it out of site of the screen boundaries. An attempt to use the
        // opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allows the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        let parentStyle;

        if (typeof visible !== 'undefined' && !visible) {
            const windowDimensions = Dimensions.get('window');

            parentStyle = {
                bottom: -windowDimensions.height,
                right: -windowDimensions.width
            };
        }

        // feedback & onPress
        if (typeof feedback === 'undefined') {
            feedback = onPress;
        }

        const renderParent = feedback || onPress;

        if (!renderParent && parentStyle) {
            style = {
                ...style,
                ...parentStyle
            };
        }

        // eslint-disable-next-line object-property-newline
        let component = this._render(View, { ...props, style });

        if (renderParent) {
            const parentType
                = feedback ? TouchableHighlight : TouchableWithoutFeedback;
            const parentProps = {};

            if (onPress) {
                parentProps.onPress = onPress;
            }
            if (parentStyle) {
                parentProps.style = parentStyle;
            }
            component = React.createElement(parentType, parentProps, component);
        }

        return component;
    }
}

/**
 * Container component's property types.
 *
 * @static
 */
Container.propTypes = AbstractContainer.propTypes;
