import React, { Component } from 'react';

import { FilmStrip } from '../../filmStrip';
import { LargeVideo } from '../../largeVideo';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer } from './ConferenceContainer';

/**
 * The conference page of the application.
 */
class Conference extends Component {

    /**
     * Initializes the 'isToolbarVisible' property state.
     */
    constructor() {
        super();
        this.state = { isToolbarVisible: false };
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ConferenceContainer onPress = { this.onPress.bind(this) }>
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
     * Changes the value of the isToolbarVisible property, thus allowing
     * us to 'switch' between toolbar and filmstrip views and change the
     * visibility of the above.
     */
    onPress() {
        this.setState({ isToolbarVisible: !this.state.isToolbarVisible });
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
