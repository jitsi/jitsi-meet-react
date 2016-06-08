import React, { Component } from 'react';
import { connect } from 'react-redux';


class ReduxState extends Component {
    render() {
        return (
          <div>
            <h1>Redux State:</h1>
            <pre>{JSON.stringify(this.props.redux, null, 2)}</pre>
          </div>
        );
    }
}


export default connect(state => { return { redux: state } })(ReduxState);

