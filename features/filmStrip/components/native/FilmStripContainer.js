import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the video thumbnails.
 */
export class FilmStripContainer extends Component {
    render() {
        return (
            <View style = { styles.filmStrip }>{ this.props.children }</View>
        );
    }
}

ParticipantsContainer.propTypes = {
    children: React.PropTypes.element
};
