import React from 'react';
import { connect } from 'react-redux';

import {
    AbstractWelcomePageContainer,
    mapStateToProps
} from './AbstractWelcomePageContainer';
import { styles } from './styles';

/**
 * The web container rendering the welcome page.
 *
 * @extends AbstractWelcomePageContainer
 */
class WelcomePageContainer extends AbstractWelcomePageContainer {
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
                    value={ this.props.roomName }  />
                <button
                    disabled={ this.props.roomName === '' }
                    onClick={ this._onJoinPress }
                    style={ styles.button }>JOIN</button>
            </div>
        );
    }
}

WelcomePageContainer.propTypes = AbstractWelcomePageContainer.propTypes;

export default connect(mapStateToProps)(WelcomePageContainer);
