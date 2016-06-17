import React, { Component } from 'react';

export class ConferenceContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}
