import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    BigVideo,
    LocalVideoThumbnail,
    RemoteVideoThumbnail
} from '../../media';
import { Toolbar } from '../../toolbar';

import { ConferenceContainer, ParticipantsContainer } from './_';


/**
 * The conference page for the application.
 */
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
                    }) }
                </ParticipantsContainer>
            </ConferenceContainer>
        );
    }
}

/**
 * Ensure that the application navigator object is passed down via props
 * on mobile.
 */
Conference.propTypes = {
    navigator: React.PropTypes.object,
    participants: React.PropTypes.object
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
