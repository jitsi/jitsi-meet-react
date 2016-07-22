import React, { Component } from 'react';

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
     * Clears the toolbarTimeout before the component unmounts.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        if (this.toolbarTimeout) {
            clearTimeout(this.toolbarTimeout);
            this.toolbarTimeout = undefined;
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ConferenceContainer onPress={ this._onPress }>
                <LargeVideo/>
                <Toolbar
                    navigator={ this.props.navigator }
                    visible={ this.state.toolbarIsVisible } />
                <FilmStrip
                    visible={ !this.state.toolbarIsVisible } />
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
        let toolbarIsVisible = !this.state.toolbarIsVisible;

        this.setState({ toolbarIsVisible });

        if (toolbarIsVisible) {
            this.toolbarTimeout = setTimeout(this._onPress, TOOLBAR_TIMEOUT_MS);
        }
    }
}

/**
 * Conference component's property types.
 *
 * Ensure that the application navigator object is passed down via props on
 * mobile.
 *
 * @static
 */
Conference.propTypes = {
    navigator: React.PropTypes.object,
    participants: React.PropTypes.object
};

export default Conference;
