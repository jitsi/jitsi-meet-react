(function (global) {

    let {
        MediaStream,
        MediaStreamTrack,
        RTCPeerConnection,
        RTCSessionDescription,
        getUserMedia
    } = require('react-native-webrtc');
    if (typeof global.webkitMediaStream === 'undefined') {
        global.webkitMediaStream = MediaStream;
    }
    if (typeof global.MediaStreamTrack === 'undefined') {
        global.MediaStreamTrack = MediaStreamTrack;
    }
    if (typeof global.webkitRTCPeerConnection === 'undefined') {
        // XXX At the time of this writing extending RTCPeerConnection using ES6
        // 'class' and 'extends' causes a runtime error related to the attempt
        // to define the onaddstream property setter. The error mentions that
        // babelHelpers.set is undefined which appears to be a thing inside
        // React Native's packager. As a workaround, extend using the pre-ES6
        // way.

        /*eslint-disable no-inner-declarations */

        /**
         * The RTCPeerConnection provided by react-native-webrtc fires
         * onaddstream before it remembers remotedescription (and thus makes it
         * available to API clients). Because that appears to be a problem for
         * lib-jitsi-meet which has been successfully running
         * on Chrome, Firefox, Temasys, etc. for a very long time, attempt to
         * meets its expectations (by extending RTCPPeerConnection).
         *
         * @class
         */
        function _RTCPeerConnection() {
            RTCPeerConnection.apply(this, arguments);

            this.onaddstream = function () {
                return (
                    (this._onaddstreamQueue
                        ? this._queueOnaddstream
                        : this._invokeOnaddstream)
                        .apply(this, arguments));
            };
            // Shadow RTCPeerConnection's onaddstream but after
            // _RTCPeerConnection has assigned to the property in question.
            // Defining the property on _RTCPeerConnection's prototype may (or
            // may not, I don't know) work but I don't want to try because the
            // following approach appears to work and I understand it.
            Object.defineProperty(this, 'onaddstream', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return this._onaddstream;
                },
                set: function (value) {
                    this._onaddstream = value;
                }
            });
        }
        /*eslint-enable no-inner-declarations */

        _RTCPeerConnection.prototype =
            Object.create(RTCPeerConnection.prototype);
        _RTCPeerConnection.prototype.constructor = _RTCPeerConnection;
        _RTCPeerConnection.prototype._invokeOnaddstream = function () {
            var onaddstream = this._onaddstream;
            var r;
            if (onaddstream) {
                r = onaddstream.apply(this, arguments);
            }
            return r;
        };
        _RTCPeerConnection.prototype._invokeQueuedOnaddstream = function (q) {
            q && q.every(function (args) {
                try {
                    this._invokeOnaddstream.apply(this, args);
                } catch (e) {
                    // TODO Determine whether the combination of the standard
                    // setRemoteDescription and onaddstream results in a similar
                    // swallowing of errors.
                    console && console.error && console.error(e);
                }
                return true;
            }, this);
        };
        _RTCPeerConnection.prototype._queueOnaddstream = function () {
            this._onaddstreamQueue.push(Array.from(arguments));
        };
        _RTCPeerConnection.prototype.setRemoteDescription =
            function (sessionDescription, successCallback, errorCallback) {
                // Ensure I'm not remembering onaddstream invocations from
                // previous setRemoteDescription calls. I shouldn't be but...
                // anyway.
                this._onaddstreamQueue = [];
                return RTCPeerConnection.prototype.setRemoteDescription.call(
                    this,
                    sessionDescription,
                    () => {
                        var r;
                        var q;
                        try {
                            if (successCallback) {
                                r = successCallback.apply(null, arguments);
                            }
                        } finally {
                            q = this._onaddstreamQueue;
                            this._onaddstreamQueue = undefined;
                        }
                        this._invokeQueuedOnaddstream(q);
                        return r;
                    },
                    () => {
                        this._onaddstreamQueue = undefined;
                        var r;
                        if (errorCallback) {
                            r = errorCallback.apply(null, arguments);
                        }
                        return r;
                    });
            };

        global.webkitRTCPeerConnection = _RTCPeerConnection;
    }
    if (typeof global.RTCSessionDescription === 'undefined') {
        global.RTCSessionDescription = RTCSessionDescription;
    }

    let navigator = global.navigator;
    if (navigator) {
        if (typeof navigator.webkitGetUserMedia === 'undefined') {
            navigator.webkitGetUserMedia = getUserMedia;
        }
    }

})(global || window || this);
