import React, { Component } from 'react';
import { View } from 'react-native';

const style = {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderWidth: 1,
    flex: 1
};

export default class VideoThumbnailContainer extends Component {
    render() {
        return (
          <View style={style}>{this.props.children}</View>
        );
    }
}
