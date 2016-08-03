import React, { Component } from 'react';

import { isRoomValid, roomSet } from '../../base/conference';
import { MEDIA_TYPE, VideoTrack } from '../../base/media';
import { navigate } from '../../base/navigator';
import { trackVideoStarted } from '../../base/tracks';
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
     * Renders a local video if any.
     *
     * @protected
     * @returns {(ReactElement|null)}
     */
    _renderLocalVideo() {
        let localVideoTrack = this.props.localVideoTrack;

        if (localVideoTrack) {
            return (
                <VideoTrack
                    videoTrack={ localVideoTrack } />
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
 *      localVideoTrack: (Track|undefined),
 *      room: string
 * }}
 */
export const mapStateToProps = state => {
    const conference = state['features/base/conference'];
    const tracks = state['features/base/tracks'];

    return {
        localVideoTrack: tracks
            .find(t => t.local && t.mediaType === MEDIA_TYPE.VIDEO),
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
    localVideoTrack: React.PropTypes.object,
    navigator: React.PropTypes.object,
    room: React.PropTypes.string
};
