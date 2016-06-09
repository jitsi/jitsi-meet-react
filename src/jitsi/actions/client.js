import JitsiMeetJS from 'lib-jitsi-meet';


import {
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_ERROR,
    JITSI_CLIENT_CONNECTED,
    JITSI_CONFERENCE_JOINED
} from './';

import {
    userJoined,
    userLeft,
    dominantSpeakerChanged,
    userRoleChanged
} from './participants';


import {
    startLocalTracks,
    localTracksAdded,
    remoteTrackAdded
} from './tracks';


const JitsiConnectionEvents = JitsiMeetJS.events.connection;
const JitsiConferenceEvents = JitsiMeetJS.events.conference;


export function init(config, room) {
    return (dispatch, getState) => {
        JitsiMeetJS.init({}).then(() => {
            const client = new JitsiMeetJS.JitsiConnection(
                config.appId,
                config.token,
                {
                    ...config.connection,
                    bosh: config.connection.bosh + ( room ? ('?room=' + room) : '' )
                }
            );

            dispatch(clientInitialized(client, room));


            client.addEventListener(
                JitsiConnectionEvents.CONNECTION_DISCONNECTED,
                msg => console.log('JitsiConnection disconnected msg: ' + msg));

            client.addEventListener(
                JitsiConnectionEvents.CONNECTION_ESTABLISHED,
                id => {
                    let conference = client.initJitsiConference(room, { openSctp: true });

                    conference.on(JitsiConferenceEvents.CONFERENCE_JOINED,
                        () => dispatch(conferenceJoined(conference)));

                    conference.on(JitsiConferenceEvents.TRACK_ADDED,
                        track => dispatch(remoteTrackAdded(track)));

                    conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED,
                        (id) => {
                            console.log('dominant speaker changed', arguments, id);
                            dispatch(dominantSpeakerChanged(id));
                        });

                    conference.on(JitsiConferenceEvents.USER_ROLE_CHANGED,
                        (id) => dispatch(userRoleChanged(id, role)));

                    conference.on(JitsiConferenceEvents.USER_JOINED,
                        (id, user) => dispatch(userJoined(id, user)));

                    conference.on(JitsiConferenceEvents.USER_LEFT,
                        (id, user) => dispatch(userLeft(id, user)));

                    conference.join();
                });

            client.addEventListener(
                JitsiConnectionEvents.CONNECTION_FAILED,
                err => console.error('JitsiConnection failed err: ' + err));

            client.connect();
        }).catch(error => {
            dispatch(clientError(error));
            throw error;
        });
    };
}


export function clientInitialized(client, room) {
    return {
        type: JITSI_CLIENT_CREATED,
        room,
        client
    };
}

export function clientConnected(id) {
    return {
        type: JITSI_CLIENT_CONNECTED,
        id
    };
}

export function clientError(error) {
    console.error(error);
    return {
        type: JITSI_CLIENT_ERROR,
        error
    };
}

export function conferenceJoined(conference) {
    return (dispatch, getState) => {
        var localTracks = getState().jitsi.localTracks;
        if (localTracks) {
            for (let track of localTracks) {
                track.isVideoTrack() && conference.addTrack(track);
            }
            for (let track of localTracks) {
                track.isVideoTrack() || conference.addTrack(track);
            }
        }
    }
    return {
        type: JITSI_CONFERENCE_JOINED,
        conference
    }
}

