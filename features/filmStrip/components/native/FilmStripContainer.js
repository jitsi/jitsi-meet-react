import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

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
        return (
            <View style = { styles.filmStrip }>{ this.props.children }</View>
        );
    }
}

/**
 * FilmStripContainer component's property types.
 *
 * @static
 */
FilmStripContainer.propTypes = {
    children: React.PropTypes.node
};
