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
              <Toolbar navigator={this.props.navigator}/>
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
