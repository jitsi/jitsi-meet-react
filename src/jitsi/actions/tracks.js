import JitsiMeetJS from 'lib-jitsi-meet';


import {
    REMOTE_TRACK_ADDED,
    LOCAL_TRACKS_ADDED,
    TOGGLE_AUDIO
} from './';


export function toggleAudio() {
    return (dispatch, getState) => {
        let localTracks = getState().jitsi.localTracks;
        for (let track of localTracks) {
            if (track.isMuted()) {
                track.unmute();
            } else {
                track.mute();
            }
        }

        return {
            type: TOGGLE_AUDIO
        };
    };
}


export function remoteTrackAdded(track) {
    return {
        type: REMOTE_TRACK_ADDED,
        track,
        participant: {
            id: track.getType()
        }
    }
}

export function startLocalTracks() {
    return (dispatch, getState) => {
        // FIXME: temporary hack to get front camera until "facingMode" constraint is implemented
        MediaStreamTrack.getSources(devices => {
            let frontCamera = devices.find(d => (d.kind === 'video' || d.kind === 'videoinput') && d.facing === 'front');

            return JitsiMeetJS.createLocalTracks({
                devices: ['audio', 'video'],
                cameraDeviceId: (frontCamera || {}).id 
            }).then(localTracks => {
                let conference = getState().jitsi.client.conference;
                if (conference) {
                    Promise.all(
                        conference.getLocalTracks()
                            .map(t => conference.removeTrack(t))
                    ).then(() => {
                        for (let track of localTracks) {
                            track.isVideoTrack() && conference.addTrack(track);
                        }
                        for (let track of localTracks) {
                            track.isVideoTrack() || conference.addTrack(track);
                        }
                    });
                }
                dispatch(localTrackCreated(localTracks))
            }).catch(reason => {
                console.error(
                    'JitsiMeetJS.createLocalTracks.catch rejection reason: '
                    + reason);
            });
        });
    }
}

export function localTracksAdded(localTracks) {
    return {
        type: LOCAL_TRACKS_ADDED,
        tracks: localTracks,
        participant: {
            id: 'local'
        }
    };
}

