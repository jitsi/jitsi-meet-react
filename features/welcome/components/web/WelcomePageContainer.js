import React, { Component } from 'react';

import styles from './styles/Styles';

/**
 * The native container rendering the welcome page.
 */
export class WelcomePageContainer extends Component {

  constructor() {
      super();

      this.state = {
          roomName: ''
      };

      this.handleChange = event => {
          this.setState({ roomName: event.target.value });
      };

      this.handleSubmit = () => {
          this.props.onJoin(this.state.roomName);
      };
  }

  render() {
      return (
          <div style={styles.container}>
            <p style={styles.title}>Enter room name</p>
            <input type="text" style={styles.textInput} onChange={this.handleChange} value={this.state.roomName}  />
            <button style={styles.button} onClick={this.handleSubmit}>JOIN</button>
          </div>
    );
  }
}

