import React, { Component } from 'react';

import { FilmStrip } from '../../filmStrip';
import { LargeVideo } from '../../largeVideo';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer } from './_';

/**
 * The conference page for the application.
 */
class Conference extends Component {
    /**
     * Implements React Component's render method.
     * @inheritdoc
     * @returns {XML}
     */
    render() {
        return (
            <ConferenceContainer>
                <LargeVideo/>
                <Toolbar navigator = { this.props.navigator }/>
                <FilmStrip/>
            </ConferenceContainer>
        );
    }
}

/**
 * Component's prop types.
 * Ensure that the application navigator object is passed down via props
 * on mobile.
 */
Conference.propTypes = {
    navigator: React.PropTypes.object,
    participants: React.PropTypes.object
};

export default Conference;