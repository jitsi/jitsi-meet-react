import React, { Component } from 'react';

export default class ConferenceContainer extends Component {
    render() {
        return (
          <div>{this.props.children}</div>
        );
    }
}
