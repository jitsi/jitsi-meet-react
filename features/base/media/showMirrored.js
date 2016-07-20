/**
 * Returns true if the provided video track should be rendered in
 * mirrored mode.
 * 
 * We only want to show a video in mirrored mode when:
 * 1) The video source is local, and not remote.
 * 2) The video source is a camera, not from a desktop capture.
 * 3) TODO The video source is capturing the user, not the environment.
 * 
 * @param {JitsiTrack} track - The video track planned for rendering.
 * @returns {boolean}
 */
export function showMirrored(track) {
    // XXX We should also check the facing mode of the track source, and only
    // mirror when the source is user facing (and not when environment facing).
    return track &&
        track.isLocal() &&
        !track.isScreenSharing();
}
