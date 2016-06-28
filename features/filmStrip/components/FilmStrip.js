import React, { Component } from 'react';
import { connect } from 'react-redux';

import VideoThumbnail from './VideoThumbnail';
import { FilmStripContainer } from './_';

class FilmStrip extends Component {
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
                                />
                            );
                        })
                }
            </FilmStripContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        participants: state['features/base/participants'],
        tracks: state['features/base/tracks']
    };
};

export default connect(mapStateToProps)(FilmStrip);