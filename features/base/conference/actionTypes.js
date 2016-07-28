/**
 * Action type to signal that we are joining the conference.
 *
 * {
 *      type: CONFERENCE_JOINED,
 *      conference: {
 *          jitsiConference: JitsiConference
 *      }
 * }
 */
export const CONFERENCE_JOINED = 'CONFERENCE_JOINED';

/**
 * Action type to signal that we have left the conference.
 *
 * {
 *      type: CONFERENCE_LEFT,
 *      conference: {
 *          jitsiConference: JitsiConference
 *      }
 * }
 */
export const CONFERENCE_LEFT = 'CONFERENCE_LEFT';

/**
 * Action to set room name.
 *
 * {
 *      type: ROOM_SET,
 *      conference: {
 *          room: string
 *      }
 * }
 */
export const ROOM_SET = 'ROOM_SET';
