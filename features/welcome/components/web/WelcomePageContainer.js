import React from 'react';

import { AbstractWelcomePageContainer } from '../AbstractWelcomePageContainer';
import { styles } from '../styles';

/**
 * The web container rendering the welcome page.
 *
 * @extends AbstractWelcomePageContainer
 */
export class WelcomePageContainer extends AbstractWelcomePageContainer {
    /**
     * Renders a prompt for entering a room name.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <div style={ styles.container }>
                <p style={ styles.title }>Enter room name</p>
                <input
                    id="welcome.WelcomePageContainer.roomName"
                    onChange={ ev => this._onRoomNameChange(ev.target.value) }
                    style={ styles.textInput }
                    type="text"
                    value={ this.state.roomName }  />
                <button
                    id="welcome.WelcomePageContainer.joinButton"
                    disabled={ this.state.roomName === '' }
                    onClick={ this._onJoinPress }
                    style={ styles.button }>JOIN</button>
            </div>
        );
    }
}

WelcomePageContainer.propTypes = AbstractWelcomePageContainer.propTypes;
