import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVideoTrack, isParticipantTrack } from '../../base/tracks';

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
                        let tracks = this.props.tracks;
                        let audioTrack = tracks.find(t => (
                            t.isAudioTrack() && isParticipantTrack(p, t)
                        ));
                        let videoTrack = getVideoTrack(p, tracks);

                        // XXX The props audioMuted and videoMuted would,
                        // generally, be computed inside VideoThumbnail because
                        // their values are derived through audioTrack and
                        // videoTrack, respectively. However, changes to the
                        // values of audioMuted or videoMuted should trigger
                        // (re)renders.
                        return (
                            <VideoThumbnail
                                audioMuted={
                                    !audioTrack || audioTrack.isMuted()
                                }
                                audioTrack={ audioTrack }
                                key={p.id}
                                participant={ p }
                                videoMuted={
                                    !videoTrack || videoTrack.isMuted()
                                }
                                videoTrack={ videoTrack }
                            />
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
        participants: state['features/base/participants'],
        tracks: state['features/base/tracks']
    };
};

/**
 * FilmStrip component's property types.
 *
 * @static
 */
FilmStrip.propTypes = {
    participants: React.PropTypes.array,
    tracks: React.PropTypes.array,
    visible: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(FilmStrip);
