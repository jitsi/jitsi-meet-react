import React, { Component } from 'react';

/**
 * The web container rendering the conference view.
 */
export class ConferenceContainer extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
