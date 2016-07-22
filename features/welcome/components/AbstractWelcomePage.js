import React, { Component } from 'react';

import { shouldMirror, Video } from '../../base/media';
import { participantVideoStarted } from '../../base/participants';

import {
    APP_SCREEN,
    navigate
} from '../../app';

/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
export class AbstractWelcomePage extends Component {
    /**
     * Initializes a new AbstractWelcomePage instance, including the initial
     * state of the room name input.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        this.state = { roomName: '' };

        // Bind event handlers so they are only bound once for every instance.
        this._onJoinPress = this._onJoinPress.bind(this);
        this._onRoomNameChange = this._onRoomNameChange.bind(this);
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        this.props.dispatch(navigate({
            navigator: this.props.navigator,
            room: this.state.roomName,
            screen: APP_SCREEN.CONFERENCE
        }));
    }

    /**
     * Handles 'change' event for the room name input field.
     *
     * @param {string} value - Name for room.
     * @protected
     * @returns {void}
     */
    _onRoomNameChange(value) {
        this.setState({ roomName: value });
    }

    /**
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying() {
        let localParticipant = this.props.localParticipant;

        if (localParticipant) {
            this.props.dispatch(participantVideoStarted(localParticipant.id));
        }
    }

    /**
     * Renders a local video if any.
     *
     * @protected
     * @returns {(ReactElement|null)}
     */
    _renderLocalVideo() {
        let localVideoTrack = this.props.localVideoTrack;

        if (localVideoTrack) {
            return (
                <Video
                    mirror={ shouldMirror(localVideoTrack) }
                    onPlaying={ this._onVideoPlaying }
                    stream={ localVideoTrack.getOriginalStream() }/>
            );
        }

        return null;
    }
}

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractWelcomePage.propTypes = {
    dispatch: React.PropTypes.func,
    localParticipant: React.PropTypes.object,
    localVideoTrack: React.PropTypes.object,
    navigator: React.PropTypes.object
};


/**
 * Selects local video track from tracks in state and local participant and maps
 * them to component props. It seems it's not possible to 'connect' base
 * component and then extend from it. So we export this function in order to be
 * used in child classes for 'connect'.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      localParticipant: (Participant|undefined),
 *      localVideoTrack: (JitsiLocalTrack|undefined)
 * }}
 */
export const mapStateToProps = state => {
    const stateFeaturesParticipants = state['features/base/participants'];
    const stateFeaturesTracks = state['features/base/tracks'];

    return {
        localParticipant: stateFeaturesParticipants
            .find(p => p.local),
        localVideoTrack: stateFeaturesTracks
            .find(t => t.isLocal() && t.isVideoTrack())
    };
};