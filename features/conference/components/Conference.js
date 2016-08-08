import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';

import {
    connect,
    disconnect
} from '../../base/connection';
import { FilmStrip } from '../../filmStrip';
import { LargeVideo } from '../../largeVideo';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer } from './ConferenceContainer';

/**
 * The timeout in milliseconds after which the toolbar view will be hidden.
 */
const TOOLBAR_TIMEOUT_MS = 5000;

/**
 * The conference page of the application.
 */
class Conference extends Component {

    /**
     * Initializes a new Conference instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = { toolbarIsVisible: false };

        /**
         */
        this.toolbarTimeout = null;

        // Bind event handlers so they are only bound once for every instance.
        this._onPress = this._onPress.bind(this);
    }

    /**
     * Inits new connection and conference when conference screen is entered.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillMount() {
        this.props.dispatch(connect(this.props.config, this.props.room));
    }

    /**
     * Destroys connection, conference and local tracks when conference screen
     * is left. Clears the toolbarTimeout before the component unmounts.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        if (this.toolbarTimeout) {
            clearTimeout(this.toolbarTimeout);
            this.toolbarTimeout = undefined;
        }

        this.props.dispatch(disconnect());
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ConferenceContainer onPress = { this._onPress }>
                <LargeVideo />
                <Toolbar visible = { this.state.toolbarIsVisible } />
                <FilmStrip visible = { !this.state.toolbarIsVisible } />
            </ConferenceContainer>
        );
    }

    /**
     * Changes the value of the toolbarIsVisible property, thus allowing us to
     * 'switch' between toolbar and filmstrip views and change the visibility of
     * the above.
     *
     * @private
     * @returns {void}
     */
    _onPress() {
        const toolbarIsVisible = !this.state.toolbarIsVisible;

        this.setState({ toolbarIsVisible });

        if (toolbarIsVisible) {
            this.toolbarTimeout = setTimeout(this._onPress, TOOLBAR_TIMEOUT_MS);
        }
    }
}

/**
 * Conference component's property types.
 *
 * @static
 */
Conference.propTypes = {
    /**
     * The configuration with which a connection is to be initialized for the
     * purposes of joining the conference depicted by the (React Component)
     * Conference instance.
     *
     * @type {Object}
     */
    config: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    room: React.PropTypes.string
};

/**
 * Maps room property from state to component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{ room: string }}
 */
// eslint-disable-next-line arrow-body-style
export const mapStateToProps = state => ({
    room: state['features/base/conference'].room
});

export default reactReduxConnect(mapStateToProps)(Conference);
