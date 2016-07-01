import React, { Component } from 'react';


/**
 * Display a user avatar.
 */
export class Avatar extends Component {

    /**
     * React render method.
     *
     * @inheritdoc
     */
    render() {
        return (
            <img src={this.props.uri} />
        );
    }
}

