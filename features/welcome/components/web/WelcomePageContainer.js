import React from 'react';

import { WelcomePageContainer as BaseWelcomePageContainer } from '../base';
import { styles } from '../styles';

/**
 * The web container rendering the welcome page.
 * 
 * @extends BaseWelcomePageContainer
 */
export class WelcomePageContainer extends BaseWelcomePageContainer {
    /**
     * Renders a prompt for entering a room name.
     *
     * @override BaseWelcomePageContainer#render()
     * @returns {ReactElement}
     */
    render() {
        return (
            <div style = { styles.container }>
                <p style ={ styles.title }>Enter room name</p>
                <input
                    type="text"
                    style = { styles.textInput }
                    onChange= {
                        event => this._onRoomNameChange(event.target.value) }
                    value= { this.state.roomName }  />
                <button
                    disabled = { this.state.roomName === '' }
                    style = { styles.button }
                    onClick = { this._onJoinPress }>JOIN</button>
            </div>
        );
    }
}

WelcomePageContainer.propTypes = BaseWelcomePageContainer.propTypes;