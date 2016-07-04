import React, { Component } from 'react';

/**
 * The web container rendering the conference view.
 */
export class ConferenceContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}

/**
 * ConferenceContainer component's property types.
 *
 * @static
 */
ConferenceContainer.propTypes = {
    children: React.PropTypes.node
};
