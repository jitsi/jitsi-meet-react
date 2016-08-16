/**
 * Returns local participant from Redux state.
 *
 * @param {(Function|Participant[])} participantsOrGetState - Either the
 * features/base/participants Redux state or Redux's getState function to be
 * used to retrieve the features/base/participants state.
 * @returns {(Participant|undefined)}
 */
export function getLocalParticipant(participantsOrGetState) {
    const participants = _getParticipantsArray(participantsOrGetState);

    return participants.find(p => p.local);
}

/**
 * Returns participant by id from Redux state.
 *
 * @param {(Function|Participant[])} participantsOrGetState - Either the
 * features/base/participants Redux state or Redux's getState function to be
 * used to retrieve the features/base/participants state.
 * @param {string} id - Participant ID.
 * @private
 * @returns {(Participant|undefined)}
 */
export function getParticipant(participantsOrGetState, id) {
    const participants = _getParticipantsArray(participantsOrGetState);

    return participants.find(p => p.id === id);
}

/**
 * Returns array of participants from Redux state.
 *
 * @param {(Function|Participant[])} participantsOrGetState - Either the
 * features/base/participants Redux state or Redux's getState function to be
 * used to retrieve the features/base/participants state.
 * @private
 * @returns {Participant[]}
 */
function _getParticipantsArray(participantsOrGetState) {
    if (typeof participantsOrGetState === 'function') {
        return participantsOrGetState()['features/base/participants'];
    }

    return participantsOrGetState || [];
}
