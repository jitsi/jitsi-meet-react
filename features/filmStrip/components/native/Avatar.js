import React, { Component } from 'react';
import { Image } from 'react-native';

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
            <Image
                source = {{ uri: this.props.uri }}
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
