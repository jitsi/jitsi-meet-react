import React, { Component } from 'react';

import styles from './styles/Styles';

/**
 * The web container rendering the welcome page.
 */
export class WelcomePageContainer extends Component {

    /**
     * Initialize the WelcomePageContainer, including the initial
     * state of the room name input.
     * @constructor
     * @param {Object} props
     */
    constructor(props) {
        super(props);

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

    /**
     * Render the WelcomePageContainer to show a prompt for
     * entering a room name.
     * @inhertidoc
     * @returns {XML}
     */
    render() {
        return (
            <div style = { styles.container }>
                <p style ={ styles.title }>Enter room name</p>
                <input
                    type="text"
                    style = { styles.textInput }
                    onChange= { this.handleChange }
                    value= { this.state.roomName }  />
                <button
                    style = { styles.button }
                    onClick = { this.handleSubmit }>JOIN</button>
            </div>
        );
    }
}

WelcomePageContainer.propTypes = {
    onJoin: React.PropTypes.func
};
