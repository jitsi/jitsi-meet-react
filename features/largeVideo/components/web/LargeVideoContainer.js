import React, { Component } from 'react';

/**
 * The web container rendering the person "on stage".
 */
export class LargeVideoContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}

LargeVideoContainer.propTypes = {
    children: React.PropTypes.element
};