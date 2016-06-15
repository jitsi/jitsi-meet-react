import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from '../../../media/components/native/styles/VideoStyle';

/**
 * The native container rendering the conference view.
 */
export default class ConferenceContainer extends Component {
    render() {
        return (
          <View style = { styles.conference }>{ this.props.children }</View>
        );
    }
}
