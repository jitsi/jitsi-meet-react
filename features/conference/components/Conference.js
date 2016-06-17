import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import { BigVideo, LocalVideoThumbnail, RemoteVideoThumbnail } from '../../media';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer, ParticipantsContainer } from './_';

class Conference extends Component {
    render() {
        return (
          <ConferenceContainer>
              <BigVideo/>
              <Toolbar navigator = { this.props.navigator }/>
              <ParticipantsContainer>
                  <LocalVideoThumbnail/>
                  { Object.keys(this.props.participants).map((id) => {
                      return <RemoteVideoThumbnail
                          key={id}
                          participantId={id}
                      />;
                  })}
              </ParticipantsContainer>
          </ConferenceContainer>
        );
    }
}

Conference.propTypes = {
    navigator: React.PropTypes.object
};

const mapStateToProps = state => {
    return {
        room: state.client.room,
        user: state.user,
        localTracks: state.localTracks,
        remoteTracks: state.remoteTracks,
        participants: state.participants
    };
};

export default connect(mapStateToProps)(Conference);
