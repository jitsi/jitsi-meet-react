/**
 * Action for when a track has been added to the conference,
 * local or remote.
 *
 * {
 *     type: TRACK_ADDED,
 *     track: JitsiTrack
 * }
 */
export const TRACK_ADDED = 'TRACK_ADDED';

/**
 * Action for when the mute status of a remote track has changed.
 *
 * {
 *     type: TRACK_MUTE_CHANGED,
 *     track: JitsiTrack
 * }
 */
export const TRACK_MUTE_CHANGED = 'TRACK_MUTE_CHANGED';

/**
 * Action for when a track has been removed from the conference,
 * local or remote.
 *
 * {
 *     type: TRACK_REMOVED,
 *     track: JitsiTrack
 * }
 */
export const TRACK_REMOVED = 'TRACK_REMOVED';
