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
        // The following property is responsible to hide/show the toolbar
        // view by moving it out of site of the screen boundaries.
        // An attempt to use the opacity property has been made in order
        // to eventually implement a fadeIn/fadeOut animation, however a known
        // react native problem has been doscovered, which allows the view to
        // still capture touch events even if hidden. Alternatives will be
        // investigated.
        var bottomValue = styles.filmStrip.bottom;
        if (!this.props.isVisible)
            bottomValue = -Dimensions.get('window').height;

        return (
            <View style = { [styles.filmStrip, { bottom: bottomValue}] }>
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
    isVisible: React.PropTypes.bool
};
