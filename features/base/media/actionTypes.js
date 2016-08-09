/**
 * Action to signal the change if facing mode of local video camera.
 *
 * {
 *      type: CAMERA_FACING_MODE_CHANGED,
 *      media: {
 *          camera: {
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
 *      type: CAMERA_MUTED_STATE_CHANGED,
 *      media: {
 *          camera: {
 *              muted: boolean
 *          }
 *      }
 * }
 */
export const CAMERA_MUTED_STATE_CHANGED = 'CAMERA_MUTED_STATE_CHANGED';

/**
 * Action to change muted state of local audio.
 *
 * {
 *      type: MICROPHONE_MUTED_STATE_CHANGED,
 *      media: {
 *          microphone: {
 *              muted: boolean
 *          }
 *      }
 * }
 */
export const MICROPHONE_MUTED_STATE_CHANGED = 'MICROPHONE_MUTED_STATE_CHANGED';
