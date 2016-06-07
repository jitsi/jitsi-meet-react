import React, { Component } from 'react';
import { Text, View } from 'react-native';

const style = {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
};

export default class Hello extends Component {
    render() {
        return (
          <View style={style}>
            <Text>Hello, World!</Text>
          </View>
        );
    }
}
