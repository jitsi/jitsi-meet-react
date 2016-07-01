import React, { Component } from 'react';

/**
 * The web container rendering the conference view.
 */
export class ConferenceContainer extends Component {
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
ConferenceContainer.propTypes = {
    children: React.PropTypes.node
};