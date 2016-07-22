import React from 'react';
import { connect } from 'react-redux';

import { AbstractWelcomePage } from './AbstractWelcomePage';
import { styles } from './styles';

/**
 * The web container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
export class WelcomePage extends AbstractWelcomePage {
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
                    onChange={ ev => this._onRoomNameChange(ev.target.value) }
                    style={ styles.textInput }
                    type="text"
                    value={ this.state.roomName }  />
                <button
                    disabled={ this.state.roomName === '' }
                    onClick={ this._onJoinPress }
                    style={ styles.button }>JOIN</button>
            </div>
        );
    }
}

/**
 * WelcomePage component's property types.
 *
 * @static
 */
WelcomePage.propTypes = AbstractWelcomePage.propTypes;

export default connect()(WelcomePage);
