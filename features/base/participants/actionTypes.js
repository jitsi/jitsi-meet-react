/**
 * Create an action for when dominant speaker changes.
 *
 * {
 *      type: DOMINANT_SPEAKER_CHANGED,
 *      participant: {
 *          id: string
 *      }
 * }
 */
export const DOMINANT_SPEAKER_CHANGED = 'DOMINANT_SPEAKER_CHANGED';

/**
 * Action to signal that ID of participant has changed. This happens when
 * local participant joins a new conference or quits one.
 *
 * {
 *      type: PARTICIPANT_ID_CHANGED,
 *      newValue: string,
 *      oldValue: string
 * }
 */
export const PARTICIPANT_ID_CHANGED = 'PARTICIPANT_ID_CHANGED';

/**
 * Action to signal that a participant has joined.
 *
 * {
 *      type: PARTICIPANT_JOINED,
 *      participant: Participant
 * }
 */
export const PARTICIPANT_JOINED = 'PARTICIPANT_JOINED';

/**
 * Action to handle case when participant lefts.
 *
 * {
 *      type: PARTICIPANT_LEFT,
 *      participant: {
 *          id: string
 *      }
 * }
 */
export const PARTICIPANT_LEFT = 'PARTICIPANT_LEFT';

/**
 * Create an action for when the participant in conference is pinned.
 *
 * {
 *      type: PARTICIPANT_PINNED,
 *      participant: {
 *          id: string
 *      }
 * }
 */
export const PARTICIPANT_PINNED = 'PARTICIPANT_PINNED';

/**
 * Action to handle case when info about participant changes.
 *
 * {
 *      type: PARTICIPANT_UPDATED,
 *      participant: Participant
 * }
 */
export const PARTICIPANT_UPDATED = 'PARTICIPANT_UPDATED';
