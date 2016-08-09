import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';

import { styles } from './styles';

/**
 * The native container rendering the video thumbnails.
 */
export class FilmStripContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allows the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        const bottom
            = this.props.visible
                ? styles.filmStrip.bottom
                : -Dimensions.get('window').height;

        return (
            <View style = { [ styles.filmStrip, { bottom } ] }>
                { this.props.children }
            </View>
        );
    }
}

/**
 * FilmStripContainer component's property types.
 *
 * @static
 */
FilmStripContainer.propTypes = {
    children: React.PropTypes.node,
    visible: React.PropTypes.bool
};
