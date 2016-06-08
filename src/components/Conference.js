import React, { Component } from 'react';
import { Text } from 'react-native';

import BigVideo from './BigVideo';
import ConferenceContainer from './native/ConferenceContainer';
import ParticipantsContainer from './native/ParticipantsContainer';
import LocalVideoThumbnail from './LocalVideoThumbnail';
import RemoteVideoThumbnail from './RemoteVideoThumbnail';

import { connect } from 'react-redux';


class Conference extends Component {

    render() {
        let localVideoStream;
        let localAudioStream;
        let remoteStreamsByParticipant = {};

        if (this.props.localTracks) {
            let videoTrack = this.props.localTracks.find(t => t.isVideoTrack());
            let audioTrack = this.props.localTracks.find(t => t.isAudioTrack());

            if (videoTrack) {
                localVideoStream = videoTrack.getOriginalStream();
            }

            if (audioTrack) {
                localAudioStream = audioTrack.getOriginalStream();
            }
        }

        if (this.props.remoteTracks) {
            this.props.remoteTracks.forEach(track => {
                let participantId = track.getParticipantId();

                if (participantId) {
                    if (!remoteStreamsByParticipant[participantId]) {
                        remoteStreamsByParticipant[participantId] = {};
                    }

                    remoteStreamsByParticipant[participantId][track.getType()]
                        = track.getOriginalStream();
                }
            });
        }

         //     <Text>{ JSON.stringify(this.props, null, 2) }</Text>
        return (
          <ConferenceContainer>
              <BigVideo stream={localVideoStream}/>
              <ParticipantsContainer>
                  <LocalVideoThumbnail
                      audioStream={localAudioStream}
                      videoStream={localVideoStream}/>
                  {this._renderRemoteVideoThumbnails(remoteStreamsByParticipant)}
              </ParticipantsContainer>
          </ConferenceContainer>
        );
    }

    _renderRemoteVideoThumbnails(remoteStreamsByParticipant) {
        let elements = [];

        for (let key in remoteStreamsByParticipant) {
            elements.push(<RemoteVideoThumbnail
                key={key}
                audioStream={remoteStreamsByParticipant[key].audio}
                videoStream={remoteStreamsByParticipant[key].video}/>);
        }

        return elements;
    }
}


const mapStateToProps = state => {
    return {
        room: state.jitsi.client.room,
        localTracks: state.jitsi.localTracks,
        remoteTracks: state.jitsi.remoteTracks,
        participants: state.jitsi.participants
    };
}


export default connect(mapStateToProps)(Conference);

