/* global MD5 */

import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_ADDED,
    PARTICIPANT_FOCUSED,
    PARTICIPANT_PINNED,
    PARTICIPANT_REMOVED,
    PARTICIPANT_SELECTED,
    PARTICIPANT_UPDATED
} from './actionTypes';
import { PARTICIPANT_ROLE } from './constants';
import './reducer';


/**
 * Returns the URL of the image for the avatar of a particular user,
 * identified by its id.
 * @param {string} userId - user id
 * @param {string} email - user email
 */
function getAvatarUrl(userId, email) {
    // TODO: Use disableThirdPartyRequests config

    let avatarId = email || userId;

    // If the ID looks like an email, we'll use gravatar.
    // Otherwise, it's a random avatar, and we'll use the configured
    // URL.
    let random = !avatarId || avatarId.indexOf('@') < 0;

    if (!avatarId) {
        avatarId = userId;
    }
    // MD5 is provided by Strophe
    avatarId = MD5.hexdigest(avatarId.trim().toLowerCase());


    let urlPref = null;
    let urlSuf = null;
    if (!random) {
        urlPref = 'https://www.gravatar.com/avatar/';
        urlSuf = "?d=wavatar&size=200";
    }
    // TODO: Use RANDOM_AVATAR_URL_PREFIX from interface config
    else {
        urlPref = 'https://robohash.org/';
        urlSuf = ".png?size=200x200";
    }

    return urlPref + avatarId + urlSuf;
}


/**
 * Create an action for when dominant speaker changes.
 *
 * @param {string} id - User id.
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
 * Action to create a local user.
 *
 * @param {string} id - User id.
 * @param {Object} [user={}] - Additional information about user.
 * @param {string} [user.displayName='me'] - User's display name.
 * @param {string} [user.avatar=''] - User's avatar.
 * @param {string} [user.role='none'] - User's role.
 * @returns {Function}
 */
export function localParticipantJoined(id, user = {}) {
    return (dispatch, getState) => {
        // Local media tracks might be already created by this moment, so
        // we try to take videoType from current video track.
        let tracks = getState()['features/base/tracks'];
        let localVideoTrack = tracks.find(t => t.isLocal() && t.isVideoTrack());

        return dispatch({
            type: PARTICIPANT_ADDED,
            participant: {
                id,
                name: user.displayName || 'me',
                role: user.role || PARTICIPANT_ROLE.NONE,
                avatar: getAvatarUrl(id, user.email),
                email: user.email,
                local: true,
                videoType: localVideoTrack
                    ? localVideoTrack.videoType
                    : undefined
            }
        });
    };
}

/**
 * Create an action for when the user in conference is focused.
 *
 * @param {string|null} id - User id or null if no one is currently focused.
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
 * @param {string} id - User id.
 * @returns {{
 *      type: PARTICIPANT_REMOVED,
 *      participant: {
 *          id: string
 *      }
 * }}
 */
export function participantLeft(id) {
    return {
        type: PARTICIPANT_REMOVED,
        participant: {
            id
        }
    };
}

/**
 * Create an action for when the user in conference is pinned.
 *
 * @param {string|null} id - User id or null if no one is currently pinned.
 * @returns {Function}
 */
export function participantPinned(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/welcome'].conference;
        let participants = getState()['features/base/participants'];
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
 * @param {string} id - User id.
 * @param {PARTICIPANT_ROLE} role - User's new role
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
 * Create an action for when the user in conference is selected.
 *
 * @param {string|null} id - User id. If null, no one is selected.
 * @returns {Function}
 */
export function participantSelected(id) {
    return (dispatch, getState) => {
        let conference = getState()['features/welcome'].conference;

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
 * Create an action for when the user's video started to play.
 *
 * @param {string} id - User id.
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
 * @param {string} id - User id.
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
 * Action to create a remote user.
 *
 * @param {string} id - User id.
 * @param {Object} [user={}] - Additional information about user.
 * @param {string} [user.displayName='Fellow Jitster'] - User's display name.
 * @param {string} [user.avatar=''] - User's avatar.
 * @param {string} [user.role='none'] - User's role.
 * @returns {{
 *      type: PARTICIPANT_ADDED,
 *      participant: {
 *          id: string,
 *          name: string,
 *          avatar: string,
 *          role: PARTICIPANT_ROLE
 *      }
 * }}
 */
export function remoteParticipantJoined(id, user = {}) {
    return {
        type: PARTICIPANT_ADDED,
        participant: {
            id,
            // TODO: get default value from interface config
            name: user.displayName || 'Fellow Jitster',
            avatar: getAvatarUrl(id),
            role: user.role || 'none'
        }
    };
}


/**
 * Action to update a participant's email.
 *
 * @param {string} id - user id
 * @param {string} email - user email
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
            avatar: getAvatarUrl(id, email),
            email
        }
    };
}

