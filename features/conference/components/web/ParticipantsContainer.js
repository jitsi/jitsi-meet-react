import React, { Component } from 'react';

import styles from './styles/Styles';


/**
 * The native container rendering the video thumbnails.
 */
export class ParticipantsContainer extends Component {
    render() {
        return (
          <div style = { styles.filmStrip }>{ this.props.children }</div>
        );
    }
}
