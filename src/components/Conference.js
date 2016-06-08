import React, { Component } from 'react';
import BigVideo from './BigVideo';
import ConferenceContainer from './native/ConferenceContainer';
import ParticipantsContainer from './native/ParticipantsContainer';
import LocalVideoThumbnail from './LocalVideoThumbnail';
import RemoteVideoThumbnail from './RemoteVideoThumbnail';
import { Text } from 'react-native';

const { MediaStreamTrack } = require('react-native-webrtc');
const jQuery = require('jquery');
require('../polyfills-browser');
jQuery(window);
require('strophe');
require('strophejs-plugins/disco/strophe.disco');
require('strophejs-plugins/caps/strophe.caps.jsonly');
require('../polyfills-browserify');
const JitsiMeetJS = require('lib-jitsi-meet');

class Conference extends Component {
    constructor(props) {
        super(props);

        var self = this;

        this.state = { conferenceName: 'reactnativetest' };
        
        JitsiMeetJS.init(/* options */ {})
            .then(/* onFulfilled */ value => {
                var domain = 'meet.jit.si';
                var connection
                    = new JitsiMeetJS.JitsiConnection(
                    /* appID */ null,
                    /* token */ null,
                    /* options */ {
                        bosh:
                        'https://' + domain + '/http-bind?room='
                        + this.state.conferenceName,
                        hosts: {
                            domain: domain,
                            focus: 'focus.' + domain,
                            muc: 'conference.' + domain
                        }
                    });
                const JitsiConnectionEvents = JitsiMeetJS.events.connection;
                connection.addEventListener(
                    JitsiConnectionEvents.CONNECTION_DISCONNECTED,
                    msg => console.log('JitsiConnection disconnected msg: ' + msg));
                connection.addEventListener(
                    JitsiConnectionEvents.CONNECTION_ESTABLISHED,
                    id => this.connectionEstablished(connection, id));
                connection.addEventListener(
                    JitsiConnectionEvents.CONNECTION_FAILED,
                    err => console.error('JitsiConnection failed err: ' + err));
                connection.connect();

                // temporary hack to get front camera until "facingMode" constraint is implemented
                MediaStreamTrack.getSources(devices => {
                    let frontCamera = devices.find(d => (d.kind === 'video' || d.kind === 'videoinput') && d.facing === 'front');

                    JitsiMeetJS.createLocalTracks(
                        /* options */ {devices: ['audio', 'video'], cameraDeviceId: (frontCamera || {}).id })
                        .then(self.localTracksCreated.bind(self))
                        .catch(/* onRejected */ reason => {
                            console.error(
                                'JitsiMeetJS.createLocalTracks.catch rejection reason: '
                                + reason);
                        });
                });
            })
            .catch(/* onRejected */ reason => {
                console.error('JitsiMeetJS.init.catch rejection reason: ' + reason);
            });
    }

    localTracksCreated(localTracks) {
        let conference = this.state.conference;

        if (conference) {
            Promise.all(conference.getLocalTracks()
                .map(t => conference.removeTrack(t)))
                .then(() => {
                    this.addLocalTracksToConference(localTracks, conference);
                    this.setState({ localTracks: localTracks });
                });
        } else {
            this.setState({ localTracks: localTracks });
        }
    }

    trackAdded(conference, track) {
        if (track.isLocal()) {
            // Local JitsiTracks are supposedly handled by localTracksCreated.
            return;
        }

        this.setState({ remoteTracks: (this.state.remoteTracks || []).concat(track) });
    }

    connectionEstablished(connection, id) {
        var conference
            = connection.initJitsiConference(
            this.state.conferenceName,
            /* options */ { openSctp: true });

        var JitsiConferenceEvents = JitsiMeetJS.events.conference;

        conference.on(
            JitsiConferenceEvents.CONFERENCE_JOINED,
            () => this.conferenceJoined(conference));

        conference.on(
            JitsiConferenceEvents.TRACK_ADDED,
            track => this.trackAdded(conference, track));

        conference.join();
    }

    conferenceJoined(conference) {
        if (typeof this.state.conference === 'undefined' || this.state.conference !== conference) {
            this.setState({ conference: conference });

            if (conference) {
                var localTracks = this.state.localTracks;
                localTracks && this.addLocalTracksToConference(localTracks, conference);
            }
        }
    }

    addLocalTracksToConference(localTracks, conference) {
        // XXX The implementation of getUserMedia provided by react-native-webrtc
        // initializes the local MediaStream instances from 1 constant label.
        // RTCPeerConnection will not add a MediaStream if a MediaStream with the same
        // label has been added already. Consequently, the second MediaStream with the
        // same label will not be streamed (to the remote endpoint). Until this issue
        // with the labels is fixed, prefer to stream the video if any and not the
        // audio MediaStream.
        var i,
            length = localTracks.length,
            track;

        // video
        for (i = 0; i < length; ++i) {
            track = localTracks[i];
            track.isVideoTrack() && conference.addTrack(track);
        }
        // audio
        for (i = 0; i < length; ++i) {
            track = localTracks[i];
            track.isVideoTrack() || conference.addTrack(track);
        }
    }

    render() {
        let localVideoStream;
        let localAudioStream;
        let remoteStreamsByParticipant = {};

        if (this.state.localTracks) {
            let videoTrack = this.state.localTracks.find(t => t.isVideoTrack());
            let audioTrack = this.state.localTracks.find(t => t.isAudioTrack());

            if (videoTrack) {
                localVideoStream = videoTrack.getOriginalStream();
            }

            if (audioTrack) {
                localAudioStream = audioTrack.getOriginalStream();
            }
        }

        if (this.state.remoteTracks) {
            this.state.remoteTracks.forEach(track => {
                let participantId = track.getParticipantId();

                if (participantId) {
                    if (!remoteStreamsByParticipant[participantId]) {
                        remoteStreamsByParticipant[participantId] = {};
                    }

                    remoteStreamsByParticipant[participantId][track.getType()]
                        = track.getOriginalStream();
                }
            });
        }

        return (
          <ConferenceContainer>
              <BigVideo stream={localVideoStream}/>
              <ParticipantsContainer>
                  <LocalVideoThumbnail
                      audioStream={localAudioStream}
                      videoStream={localVideoStream}/>
                  {this._renderRemoteVideoThumbnails(remoteStreamsByParticipant)}
              </ParticipantsContainer>
          </ConferenceContainer>
        );
    }

    _renderRemoteVideoThumbnails(remoteStreamsByParticipant) {
        let elements = [];

        for (let key in remoteStreamsByParticipant) {
            elements.push(<RemoteVideoThumbnail
                key={key}
                audioStream={remoteStreamsByParticipant[key].audio}
                videoStream={remoteStreamsByParticipant[key].video}/>);
        }

        return elements;
    }
}

export default Conference;
