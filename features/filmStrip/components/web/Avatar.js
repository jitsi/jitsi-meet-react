import React, { Component } from 'react';

import { styles } from './styles';

/**
 * Display a participant avatar.
 */
export class Avatar extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <img
                src = { this.props.uri }
                style = { styles.avatar } />
        );
    }
}

/**
 * Avatar component's property types.
 *
 * @static
 */
Avatar.propTypes = {
    uri: React.PropTypes.string
};
