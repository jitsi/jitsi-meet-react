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
            <FilmStripContainer>
            {
                this.props.participants
                    .sort((a, b) => b.local - a.local)
                    .map(p => {
                        let audioTrack = this.props.tracks.find(t => (
                            t.isAudioTrack() && _isParticipantTrack(p, t)
                        ));
                        let videoTrack = this.props.tracks.find(t => (
                            t.isVideoTrack() && _isParticipantTrack(p, t)
                        ));

                        // XXX The props audioMuted and videoMuted would,
                        // generally, be computed inside VideoThumbain because
                        // their values are derived through audioTrack and
                        // videoTrack, respectively. However, changes to the
                        // values of audioMuted or videoMuted should trigger
                        // (re)renders.
                        return (
                            <VideoThumbnail
                                audioTrack={audioTrack}
                                audioMuted={!audioTrack || audioTrack.isMuted()}
                                key={p.id}
                                participant={p}
                                videoTrack={videoTrack}
                                videoMuted={!videoTrack || videoTrack.isMuted()}
                            />
                        );
                    })
            }
            </FilmStripContainer>
        );
    }
}

/**
 * Determines whether a specific JitsiTrack belongs to a specific participant.
 *
 * @param {Object} p - The participant who is the possible owner of the
 * specified JitsiTrack.
 * @param {JitsiTrack} t - The JitsiTrack which is to be determined whether it
 * belongs to the specified participant
 * @returns {boolean} True if the specified JitsiTrack belongs to the specified
 * participant; otherwise, false.
 */
function _isParticipantTrack(p, t) {
    // XXX The method getParticipantId() is defined on JitsiRemoteTrack only.
    return t.isLocal() ? p.local : (t.getParticipantId() === p.id);
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
