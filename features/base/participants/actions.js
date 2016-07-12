/* global MD5 */

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_FOCUSED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_PINNED,
    PARTICIPANT_SELECTED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import { PARTICIPANT_ROLE } from './constants';
import './reducer';

/**
 * Action to update a participant's email.
 *
 * @param {string} id - Participant's id.
 * @param {string} email - Participant's email.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          avatar: string,
 *          email: string
 *      }
 * }}
 */
export function changeParticipantEmail(id, email) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            avatar: _getAvatarURL(id, email),
            email
        }
    };
}

/**
 * Create an action for when dominant speaker changes.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: DOMINANT_SPEAKER_CHANGED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function dominantSpeakerChanged(id) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            id
        }
    };
}

/**
 * Action to create a local participant.
 *
 * @param {string} id - Participant id.
 * @param {Object} [participant={}] - Additional information about participant.
 * @param {string} [participant.displayName='me'] - Participant's display name.
 * @param {string} [participant.avatar=''] - Participant's avatar.
 * @param {string} [participant.role='none'] - Participant's role.
 * @returns {Function}
 */
export function localParticipantJoined(id, participant = {}) {
    return (dispatch, getState) => {
        // Local media tracks might be already created by this moment, so
        // we try to take videoType from current video track.
        let tracks = getState()['features/base/tracks'];
        let localVideoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());

        return dispatch({
            type: PARTICIPANT_JOINED,
            participant: {
                id,
                avatar: _getAvatarURL(id, participant.email),
                email: participant.email,
                local: true,
                name: participant.displayName || 'me',
                role: participant.role || PARTICIPANT_ROLE.NONE,
                videoType: localVideoTrack
                    ? localVideoTrack.videoType
                    : undefined
            }
        });
    };
}

/**
 * Create an action for when the participant in conference is focused.
 *
 * @param {string|null} id - Participant id or null if no one is currently
 *     focused.
 * @returns {{
 *      type: PARTICIPANT_FOCUSED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantFocused(id) {
    return {
        type: PARTICIPANT_FOCUSED,
        participant: {
            id
        }
    };
}

/**
 * Action to handle case when participant lefts.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: PARTICIPANT_LEFT,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantLeft(id) {
    return {
        type: PARTICIPANT_LEFT,
        participant: {
            id
        }
    };
}

/**
 * Create an action for when the participant in conference is pinned.
 *
 * @param {string|null} id - Participant id or null if no one is currently
 *     pinned.
 * @returns {Function}
 */
export function participantPinned(id) {
    return (dispatch, getState) => {
        let state = getState();
        let conference = state['features/base/conference'];
        let participants = state['features/base/participants'];
        let participant = participants.find(p => p.id === id);
        let localParticipant = participants.find(p => p.local);

        // This condition prevents signaling to pin local participant. Here is
        // the logic: if we have ID, then we check if participant by that ID is
        // local. If we don't have ID and thus no participant by ID, we check
        // for local participant. If it's currently pinned, then this action
        // will unpin him and that's why we won't signal here too.
        if ((participant && !participant.local) ||
            (!participant && (!localParticipant || !localParticipant.pinned))) {
            conference.pinParticipant(id);
        }

        return dispatch({
            type: PARTICIPANT_PINNED,
            participant: {
                id
            }
        });
    };
}

/**
 * Action to handle case when participant's role changes.
 *
 * @param {string} id - Participant id.
 * @param {PARTICIPANT_ROLE} role - Participant's new role.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          role: PARTICIPANT_ROLE
 *      }
 * }}
 */
export function participantRoleChanged(id, role) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            role
        }
    };
}

/**
 * Create an action for when the participant in conference is selected.
 *
 * @param {string|null} id - Participant id. If null, no one is selected.
 * @returns {Function}
 */
export function participantSelected(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/base/conference'];

        conference && conference.selectParticipant(id);

        return dispatch({
            type: PARTICIPANT_SELECTED,
            participant: {
                id
            }
        });
    };
}

/**
 * Create an action for when the participant's video started to play.
 *
 * @param {string} id - Participant id.
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          videoStarted: boolean
 *      }
 * }}
 */
export function participantVideoStarted(id) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            videoStarted: true
        }
    };
}

/**
 * Create an action for when participant video type changes.
 *
 * @param {string} id - Participant id.
 * @param {string} videoType - Video type ('desktop' or 'camera').
 * @returns {{
 *      type: PARTICIPANT_UPDATED,
 *      participant: {
 *          id: string,
 *          videoType: string
 *      }
 * }}
 */
export function participantVideoTypeChanged(id, videoType) {
    return {
        type: PARTICIPANT_UPDATED,
        participant: {
            id,
            videoType
        }
    };
}

/**
 * Action to create a remote participant.
 *
 * @param {string} id - Participant id.
 * @param {Object} [participant={}] - Additional information about participant.
 * @param {string} [participant.avatar=''] - Participant's avatar.
 * @param {string} [participant.displayName='Fellow Jitster'] - Participant's
 * display name.
 * @param {string} [participant.role='none'] - Participant's role.
 * @returns {{
 *      type: PARTICIPANT_JOINED,
 *      participant: {
 *          id: string,
 *          avatar: string,
 *          name: string,
 *          role: PARTICIPANT_ROLE
 *      }
 * }}
 */
export function remoteParticipantJoined(id, participant = {}) {
    return {
        type: PARTICIPANT_JOINED,
        participant: {
            id,
            avatar: _getAvatarURL(id),
            // TODO: get default value from interface config
            name: participant.displayName || 'Fellow Jitster',
            role: participant.role || 'none'
        }
    };
}

/**
 * Returns the URL of the image for the avatar of a particular participant
 * identified by their id and/or e-mail address.
 *
 * @param {string} participantId - Participant's id.
 * @param {string} email - Participant's email.
 * @returns {string} The URL of the image for the avatar of the participant
 * identified by the specified participantId and/or email.
 */
function _getAvatarURL(participantId, email) {
    // TODO: Use disableThirdPartyRequests config

    let avatarId = email || participantId;

    // If the ID looks like an email, we'll use gravatar.
    // Otherwise, it's a random avatar, and we'll use the configured
    // URL.
    let random = !avatarId || avatarId.indexOf('@') < 0;

    if (!avatarId) {
        avatarId = participantId;
    }
    // MD5 is provided by Strophe
    avatarId = MD5.hexdigest(avatarId.trim().toLowerCase());

    let urlPref = null;
    let urlSuf = null;
    if (!random) {
        urlPref = 'https://www.gravatar.com/avatar/';
        urlSuf = '?d=wavatar&size=200';
    }
    // TODO: Use RANDOM_AVATAR_URL_PREFIX from interface config
    else {
        urlPref = 'https://robohash.org/';
        urlSuf = '.png?size=200x200';
    }

    return urlPref + avatarId + urlSuf;
}
