import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles/VideoStyle';

/**
 * The native container rendering the person "on stage".
 */
export default class BigVideoContainer extends Component {
    render() {
        return (
          <View style = { styles.conference }>{ this.props.children }</View>
        );
    }
}
