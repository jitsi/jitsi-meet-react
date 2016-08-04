/**
 * Returns local participant from Redux state.
 *
 * @param {Function} participantsOrGetState - Either the
 * features/base/participants Redux state or Redux's getState function to be
 * used to retrieve the features/base/participants state.
 * @private
 * @returns {(Participant|undefined)}
 */
export function getLocalParticipant(participantsOrGetState) {
    let participants;

    if (typeof participantsOrGetState === 'function') {
        let getState = participantsOrGetState;

        participants = getState()['features/base/participants'];
    } else {
        participants = participantsOrGetState;
    }

    return participants.find(p => p.local);
}
