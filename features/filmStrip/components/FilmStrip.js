import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoThumbnail from './VideoThumbnail';
import { FilmStripContainer } from './_';

/**
 * React component for film strip.
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
            <FilmStripContainer>
                {
                    this.props.participants
                        .sort((a,b) => b.local - a.local)
                        .map(p => {
                            let videoTrack = this.props.tracks.find(t => {
                                return t.isVideoTrack() &&
                                    ((p.local && t.isLocal()) ||
                                    (!p.local && !t.isLocal() &&
                                        t.getParticipantId() === p.id));
                            });

                            let audioTrack = this.props.tracks.find(t => {
                                return t.isAudioTrack() &&
                                    ((p.local && t.isLocal()) ||
                                    (!p.local && !t.isLocal() &&
                                        t.getParticipantId() === p.id));
                            });

                            return (
                                <VideoThumbnail
                                    key={p.id}
                                    participant={p}
                                    videoTrack={videoTrack}
                                    audioTrack={audioTrack}
                                    audioMuted={!audioTrack ||
                                        (audioTrack && audioTrack.isMuted())}
                                    videoMuted={!videoTrack ||
                                        (videoTrack && videoTrack.isMuted())}
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
    tracks: React.PropTypes.array
};

export default connect(mapStateToProps)(FilmStrip);
