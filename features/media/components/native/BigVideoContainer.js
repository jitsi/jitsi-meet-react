import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the person "on stage".
 */
export class BigVideoContainer extends Component {
    render() {
        return (
          <View style = { styles.conference }>{ this.props.children }</View>
        );
    }
}

BigVideoContainer.propTypes = {
    children: React.PropTypes.element
};