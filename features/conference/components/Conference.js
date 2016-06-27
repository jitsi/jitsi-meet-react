import React, { Component } from 'react';

import { LargeVideo } from '../../largeVideo';
import { Toolbar } from '../../toolbar';
import { FilmStrip } from '../../filmStrip';

import { ConferenceContainer } from './_';

/**
 * The conference page for the application.
 */
class Conference extends Component {
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
 * Ensure that the application navigator object is passed down via props
 * on mobile.
 */
Conference.propTypes = {
    navigator: React.PropTypes.object
};

export default Conference;