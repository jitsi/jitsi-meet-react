import React, { Component } from 'react';

import { isRoomValid, roomSet } from '../../base/conference';
import { shouldMirror, Video } from '../../base/media';
import { navigate } from '../../base/navigator';
import { participantVideoStarted } from '../../base/participants';
import { Conference } from '../../conference';

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

        /**
         * Save room name into component's local state.
         *
         * @type {{room: string}}
         */
        this.state = {
            room: ''
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onJoinPress = this._onJoinPress.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }

    /**
     * Resets room name to empty string when welcome page screen is entered.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillMount() {
        this.props.dispatch(roomSet(''));
    }

    /**
     * This method is executed when component receives new properties.
     *
     * @inheritdoc
     * @param {Object} nextProps - New props component will receive.
     */
    componentWillReceiveProps(nextProps) {
        this.setState({ room: nextProps.room });
    }

    /**
     * Determines whether the 'Join' button is (to be) disabled i.e. there's no
     * valid room name typed into the respective text input field.
     *
     * @protected
     * @returns {boolean} If the 'Join' button is (to be) disabled, true;
     * otherwise, false.
     */
    _isJoinDisabled() {
        return !isRoomValid(this.state.room);
    }

    /**
     * Handles click on 'Join' button.
     *
     * @protected
     * @returns {void}
     */
    _onJoinPress() {
        let room = this.state.room;

        this.props.dispatch(roomSet(room));
        this.props.dispatch(navigate({
            component: Conference,
            navigator: this.props.navigator,
            room
        }));
    }

    /**
     * Handles 'change' event for the room name text input field.
     *
     * @param {string} value - The text typed into the respective text input
     * field.
     * @protected
     * @returns {void}
     */
    _onRoomChange(value) {
        this.setState({ room: value });
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
            // FIXME
            // https://github.com/jitsi/jitsi-meet-react/pull/62/files#r73215760
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
 * Selects local video track from tracks in state, local participant and room
 * and maps them to component props. It seems it's not possible to 'connect'
 * base component and then extend from it. So we export this function in order
 * to be used in child classes for 'connect'.
 *
 * @param {Object} state - Redux state.
 * @returns {{
 *      localParticipant: (Participant|undefined),
 *      localVideoTrack: (JitsiLocalTrack|undefined),
 *      room: string
 * }}
 */
export const mapStateToProps = state => {
    const conference = state['features/base/conference'];
    const participants = state['features/base/participants'];
    const tracks = state['features/base/tracks'];

    return {
        localParticipant: participants.find(p => p.local),
        localVideoTrack: tracks.find(t => t.isLocal() && t.isVideoTrack()),
        room: conference.room
    };
};

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractWelcomePage.propTypes = {
    dispatch: React.PropTypes.func,
    localParticipant: React.PropTypes.object,
    localVideoTrack: React.PropTypes.object,
    navigator: React.PropTypes.object,
    room: React.PropTypes.string
};
