import React, { Component } from 'react';

import styles from '../../styles';

/**
 * The web container rendering the video thumbnails.
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
            <div style = { styles.filmStrip }>{ this.props.children }</div>
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
