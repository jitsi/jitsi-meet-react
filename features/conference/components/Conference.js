import React, { Component } from 'react';

import { FilmStrip } from '../../filmStrip';
import { LargeVideo } from '../../largeVideo';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer } from './ConferenceContainer';

/**
 * The timeout in milliseconds after which the toolbar view will be hidden.
 */
const toolbarTimeoutValue = 5000;

/**
 * The conference page of the application.
 */
class Conference extends Component {

    /**
     * Initializes the 'isToolbarVisible' property state.
     *
     * @param {Object} props - The read-only properties with which the new
     *      instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = { isToolbarVisible: false };
        this.toolbarTimeout = null;
        this._onPress = this._onPress.bind(this);
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
                <LargeVideo/>
                <Toolbar
                    isVisible = { this.state.isToolbarVisible }
                    navigator = { this.props.navigator }/>
                <FilmStrip
                    isVisible = { !this.state.isToolbarVisible } />
            </ConferenceContainer>
        );
    }

    /**
     * Clears the toolbarTimeout before the component unmounts.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        if (this.toolbarTimeout)
            clearTimeout(this.toolbarTimeout);
    }

    /**
     * Changes the value of the isToolbarVisible property, thus allowing
     * us to 'switch' between toolbar and filmstrip views and change the
     * visibility of the above.
     *
     * @private
     * @returns {void}
     */
    _onPress() {
        var isVisible = !this.state.isToolbarVisible;

        this.setState({ isToolbarVisible: isVisible });

        if (isVisible)
            this.toolbarTimeout = setTimeout(
                this._onPress,
                toolbarTimeoutValue
            );
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
