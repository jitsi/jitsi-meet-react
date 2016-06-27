import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles/Styles';

/**
 * The native container rendering the person "on stage".
 */
export class LargeVideoContainer extends Component {
    render() {
        return (
          <View style = { styles.largeVideo }>{ this.props.children }</View>
        );
    }
}
