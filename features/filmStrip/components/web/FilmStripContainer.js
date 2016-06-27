import React, { Component } from 'react';

import styles from './styles/Styles';


/**
 * The web container rendering the video thumbnails.
 */
export class FilmStripContainer extends Component {
    render() {
        return (
            <div style = { styles.filmStrip }>{ this.props.children }</div>
        );
    }
}
