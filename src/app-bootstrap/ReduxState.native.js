import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';


const style = {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
};

class ReduxState extends Component {
    render() {
        return (
          <View style={style}>
            <Text>Redux State:</Text>
            <Text>{JSON.stringify(this.props.redux, null, 2)}</Text>
          </View>
        );
    }
}


export default connect(state => { return { redux: state } })(ReduxState);

