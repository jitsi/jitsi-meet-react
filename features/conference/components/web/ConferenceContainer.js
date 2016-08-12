import React, { Component } from 'react';

import { styles } from '../styles';

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
            <div style = { styles.conference }>{ this.props.children }</div>
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
