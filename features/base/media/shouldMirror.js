/**
 * Returns true if the provided JitsiTrack should be rendered as a mirror.
 *
 * We only want to show a video in mirrored mode when:
 * 1) The video source is local, and not remote.
 * 2) The video source is a camera, not a desktop (capture).
 * 3) TODO The video source is capturing the user, not the environment.
 * 
 * @param {JitsiTrack} track - The JitsiTrack (planned for rendering).
 * @returns {boolean}
 */
export function shouldMirror(track) {
    // XXX We should also check the facing mode of the track source, and only
    // mirror when the source is user facing (and not environment facing).
    return (
        track
            && track.isLocal()
            && track.isVideoTrack()
            && !track.isScreenSharing()
    );
}
