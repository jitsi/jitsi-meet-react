import React, { Component } from 'react';

import styles from './styles/Styles';

/**
 * The web container rendering the video thumbnails.
 */
export class FilmStripContainer extends Component {
    /**
     * React component render method.
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <div style = { styles.filmStrip }>{ this.props.children }</div>
        );
    }
}

FilmStripContainer.propTypes = {
    children: React.PropTypes.node
};
