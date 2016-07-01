import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the video thumbnails.
 */
export class FilmStripContainer extends Component {
    /**
     * React component render method.
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <View style = { styles.filmStrip }>{ this.props.children }</View>
        );
    }
}

FilmStripContainer.propTypes = {
    children: React.PropTypes.node
};
