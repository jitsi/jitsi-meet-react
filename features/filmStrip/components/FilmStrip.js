import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoThumbnail from './VideoThumbnail';
import { FilmStripContainer } from './_';

/**
 * React component for film strip.
 *
 * @extends Component
 */
class FilmStrip extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <FilmStripContainer visible={ this.props.visible }>
            {
                this.props.participants
                    .sort((a, b) => b.local - a.local)
                    .map(p => {
                        return (
                            <VideoThumbnail
                                key={p.id}
                                participant={p} />
                        );
                    })
            }
            </FilmStripContainer>
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      participants: Participant[],
 *      tracks: (JitsiLocalTrack|JitsiRemoteTrack)[]
 *  }}
 */
const mapStateToProps = state => {
    return {
        participants: state['features/base/participants']
    };
};

/**
 * FilmStrip component's property types.
 *
 * @static
 */
FilmStrip.propTypes = {
    participants: React.PropTypes.array,
    visible: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(FilmStrip);
