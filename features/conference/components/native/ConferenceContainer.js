import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the conference view.
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
            <View style = { styles.conference }>{ this.props.children }</View>
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
