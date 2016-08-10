/**
 * Action to change muted state of local audio.
 *
 * {
 *      type: AUDIO_MUTED_STATE_CHANGED,
 *      media: {
 *          audio: {
 *              muted: boolean
 *          }
 *      }
 * }
 */
export const AUDIO_MUTED_STATE_CHANGED = 'AUDIO_MUTED_STATE_CHANGED';

/**
 * Action to signal the change if facing mode of local video camera.
 *
 * {
 *      type: CAMERA_FACING_MODE_CHANGED,
 *      media: {
 *          video: {
 *              facingMode: CAMERA_FACING_MODE
 *          }
 *      }
 * }
 */
export const CAMERA_FACING_MODE_CHANGED = 'CAMERA_FACING_MODE_CHANGED';

/**
 * Action to change muted state of local video.
 *
 * {
 *      type: VIDEO_MUTED_STATE_CHANGED,
 *      media: {
 *          video: {
 *              muted: boolean
 *          }
 *      }
 * }
 */
export const VIDEO_MUTED_STATE_CHANGED = 'VIDEO_MUTED_STATE_CHANGED';
