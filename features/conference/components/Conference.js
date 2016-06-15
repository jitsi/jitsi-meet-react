import React, { Component } from 'react';
import { Text } from 'react-native';

import BigVideo from '../../media/components/BigVideo';
import ConferenceContainer from './native/ConferenceContainer';
import ParticipantsContainer from './native/ParticipantsContainer';
import LocalVideoThumbnail from '../../media/components/LocalVideoThumbnail';
import RemoteVideoThumbnail from '../../media/components/RemoteVideoThumbnail';
import Toolbar from '../../toolbar/components/Toolbar';

import { connect } from 'react-redux';

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
