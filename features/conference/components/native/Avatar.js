import React, { Component } from 'react';
import { Image } from 'react-native';

import { styles } from '../styles';

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

                // XXX Avatar is expected to display the whole image.
                resizeMode = 'contain'
                source = {{ uri: this.props.uri }}
                style = { [ styles.avatar, this.props.style ] } />
        );
    }
}

/**
 * Avatar component's property types.
 *
 * @static
 */
Avatar.propTypes = {

    /**
     * The optional style to add to an Avatar in order to customize its base
     * look (and feel).
     */
    style: React.PropTypes.object,
    uri: React.PropTypes.string
};
