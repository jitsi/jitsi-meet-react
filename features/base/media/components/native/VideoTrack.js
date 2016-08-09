import React from 'react';
import { Animated } from 'react-native';
import { connect } from 'react-redux';

import { AbstractVideoTrack } from '../AbstractVideoTrack';
import { styles } from './styles';

/**
 * Component that renders video element for a specified video track.
 *
 * @extends AbstractVideoTrack
 */
class VideoTrack extends AbstractVideoTrack {
    /**
     * Initializes a new VideoTrack instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props) {
        super(props);

        /**
         * Reference to currently running animation if any.
         *
         * @private
         */
        this._animation = null;

        /**
         * Extend Component's state with additional animation-related vars.
         *
         * @type {Object}
         */
        this.state = {
            ...this.state,
            fadeAnimation: new Animated.Value(1),
            flipAnimation: new Animated.Value(1)
        };
    }

    /**
     * Renders video element with animation.
     *
     * @override
     * @returns {ReactElement}
     */
    render() {
        return (
            <Animated.View
                style = { [ styles.video, this._getAnimationStyles() ] }>
                { super.render() }
            </Animated.View>
        );
    }

    /**
     * Animates appearance of new video track.
     *
     * @private
     * @param {Track} videoTrack - New video track to show.
     * @returns {Promise}
     */
    _animateChangeVideoTrack(videoTrack) {
        // If we're in process of animating, and new animation is going to
        // start, stop the previous one first and reset animated values.
        if (this._animation) {
            this._animation.stop();
            this.state.fadeAnimation.setValue(1);
            this.state.flipAnimation.setValue(1);
        }

        // If we're switching between two local video tracks, that actually
        // means we're switching local cameras, so we will use 'flip'-style
        // animation in this case. In other case we will use 'fade'-style
        // animation.
        const animation = this.state.videoTrack.local && videoTrack.local
            ? 'flipAnimation'
            : 'fadeAnimation';

        return this._animateHidePreviousVideoTrack(animation)
            .then(() => this._animateShowNewVideoTrack(animation, videoTrack))
            .catch(() => {
                console.log('Animation was stopped');
            });
    }

    /**
     * Animates hiding of the current video.
     *
     * @param {string} animation - State variable to animate.
     * @private
     * @returns {Promise}
     */
    _animateHidePreviousVideoTrack(animation) {
        return new Promise((resolve, reject) => {
            this._animation = Animated.timing(
                this.state[animation],
                { toValue: 0 }
            );

            this._animation.start(result => {
                this._animation = null;
                result.finished ? resolve() : reject();
            });
        });
    }

    /**
     * Animates showing of the new video.
     *
     * @param {string} animation - State variable to animate.
     * @param {Track} videoTrack - New video track to show.
     * @private
     * @returns {Promise}
     */
    _animateShowNewVideoTrack(animation, videoTrack) {
        return new Promise((resolve, reject) => {
            super._changeVideoTrack(videoTrack);

            this._animation = Animated.timing(
                this.state[animation],
                { toValue: 1 }
            );

            this._animation.start(result => {
                this._animation = null;
                result.finished ? resolve() : reject();
            });
        });
    }

    /**
     * Changes the current video track. Animates if it's new JitsiTrack.
     *
     * @override
     * @param {Track} videoTrack - New video track to show.
     * @returns {void}
     */
    _changeVideoTrack(videoTrack) {
        // If JitsiTrack instance didn't change, that means some other track's
        // props were changed and we don't need to animate re-rendering of the
        // video element.
        if ((this.state.videoTrack
                && this.state.videoTrack.jitsiTrack === videoTrack.jitsiTrack)
            || !this.state.videoTrack) {
            super._changeVideoTrack(videoTrack);
        } else {
            this._animateChangeVideoTrack(videoTrack);
        }
    }

    /**
     * Returns animation styles for Animated.View.
     *
     * @private
     * @returns {Object}
     */
    _getAnimationStyles() {
        return {
            opacity: this.state.fadeAnimation,
            transform: [ {
                rotateY: this.state.flipAnimation.interpolate({
                    inputRange: [ 0, 1 ],
                    outputRange: [ '90deg', '0deg' ]
                })
            } ]
        };
    }
}

/**
 * Component's property types.
 *
 * @static
 */
VideoTrack.propTypes = AbstractVideoTrack.propTypes;

export default connect()(VideoTrack);
