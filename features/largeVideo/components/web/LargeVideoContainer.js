import React, { Component } from 'react';

import styles from '../styles/Styles';

/**
 * The web container rendering the person "on stage".
 */
export class LargeVideoContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
          <div style={ styles.container }>{ this.props.children }</div>
        );
    }
}

/**
 * LargeVideoContainer component's property types.
 *
 * @static
 */
LargeVideoContainer.propTypes = {
    children: React.PropTypes.node
};
