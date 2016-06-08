import React, { Component } from 'react';
import { View, Text } from 'react-native';

const style = {
    alignSelf: 'stretch',
    flex: 1,
    right: 5,
    bottom: 5,
    position: 'absolute',
    flexDirection: 'row'
};

export default class ParticipantsContainer extends Component {
    render() {
        return (
          <View style={style}>{this.props.children}</View>
        );
    }
}
