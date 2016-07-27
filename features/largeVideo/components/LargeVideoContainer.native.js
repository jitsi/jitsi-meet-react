import React, { Component } from 'react';
import { View } from 'react-native';

import { styles } from './styles';

/**
 * The native container rendering the conference participant whose video is
 * displayed as a large one rather than as a thumbnail.
 */
export class LargeVideoContainer extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <View style={ styles.largeVideo }>{ this.props.children }</View>
        );
    }
}

/**
 * LargeVideoContainer component's property types.
 *
 * @static
 */
LargeVideoContainer.propTypes = {
    children: React.PropTypes.node
};
