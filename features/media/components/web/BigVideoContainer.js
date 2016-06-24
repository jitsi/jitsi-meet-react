import React, { Component } from 'react';

export class BigVideoContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}

BigVideoContainer.propTypes = {
    children: React.PropTypes.element
};