import React, { Component } from 'react';

import styles from './styles/Styles';


/**
 * The web container rendering the video thumbnails.
 */
export class ParticipantsContainer extends Component {
    render() {
        return (
            <div style = { styles.filmStrip }>{ this.props.children }</div>
        );
    }
}

ParticipantsContainer.propTypes = {
    children: React.PropTypes.element
};