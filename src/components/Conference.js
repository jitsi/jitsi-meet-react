import React, { Component } from 'react';
import { Text } from 'react-native';

import BigVideo from './BigVideo';
import ConferenceContainer from './native/ConferenceContainer';
import ParticipantsContainer from './native/ParticipantsContainer';
import LocalVideoThumbnail from './LocalVideoThumbnail';
import RemoteVideoThumbnail from './RemoteVideoThumbnail';
import Toolbar from './Toolbar';

import { connect } from 'react-redux';

class Conference extends Component {
    render() {
        return (
          <ConferenceContainer>
              <BigVideo/>
              <ParticipantsContainer>
                  <LocalVideoThumbnail/>
                  {Object.keys(this.props.participants).map((id) => {
                      return <RemoteVideoThumbnail
                          key={id}
                          participantId={id}
                      />;
                  })}
              </ParticipantsContainer>
              <Toolbar/>
          </ConferenceContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        room: state.jitsi.client.room,
        user: state.jitsi.client.user,
        localTracks: state.jitsi.localTracks,
        remoteTracks: state.jitsi.remoteTracks,
        participants: state.jitsi.participants
    };
};

export default connect(mapStateToProps)(Conference);
