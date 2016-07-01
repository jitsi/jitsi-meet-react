import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the conference view.
 */
export class ConferenceContainer extends Component {
    /**
     * Implements React Component's render method.
     * 
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <View style = { styles.conference }>{ this.props.children }</View>
        );
    }
}

/**
 * Prop types for component.
 */
ConferenceContainer.propTypes = {
    children: React.PropTypes.node
};
