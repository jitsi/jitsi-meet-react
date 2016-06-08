import React, { Component } from 'react';

export default class BigVideoContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}
