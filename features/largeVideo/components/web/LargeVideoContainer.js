import React, { Component } from 'react';

export class LargeVideoContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}
