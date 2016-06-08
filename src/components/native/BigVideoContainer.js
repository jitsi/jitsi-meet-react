import React, { Component } from 'react';
import { View, Text } from 'react-native';

const style = {
    alignSelf: 'stretch',
    flex: 1
};

export default class BigVideoContainer extends Component {
    render() {
        return (
          <View style={style}>{this.props.children}</View>
        );
    }
}
