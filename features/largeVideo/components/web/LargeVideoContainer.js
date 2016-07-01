import React, { Component } from 'react';

/**
 * The web container rendering the person "on stage".
 */
export class LargeVideoContainer extends Component {
    /**
     * Implements React Component's render method.
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}

/**
 * Prop types for component.
 */
LargeVideoContainer.propTypes = {
    children: React.PropTypes.node
};