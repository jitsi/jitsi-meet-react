/**
 * Action for when a track has been added to the conference,
 * local or remote.
 *
 * {
 *     type: TRACK_ADDED,
 *     track: Track
 * }
 */
export const TRACK_ADDED = 'TRACK_ADDED';

/**
 * Action for when a track has changed.
 *
 * {
 *     type: TRACK_CHANGED,
 *     track: Track
 * }
 */
export const TRACK_CHANGED = 'TRACK_CHANGED';

/**
 * Action for when a track has been removed from the conference,
 * local or remote.
 *
 * {
 *     type: TRACK_REMOVED,
 *     track: Track
 * }
 */
export const TRACK_REMOVED = 'TRACK_REMOVED';
