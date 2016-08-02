import JitsiMeetJS from '../lib-jitsi-meet';

const JitsiTrackErrors = JitsiMeetJS.errors.track;

/**
 * This file contains some helper functions that are used in different parts
 * of the app.
 */

/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {Promise}
 */
export function addLocalTracksToConference(conference, localTracks) {
    let conferenceLocalTracks = conference.getLocalTracks();
    let promises = [];

    for (let track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (-1 === conferenceLocalTracks.indexOf(track)) {
            promises.push(conference.addTrack(track)
                .catch(err => {
                    reportError('Failed to add local track to conference', err);
                }));
        }
    }

    return Promise.all(promises);
}

/**
 * Helper function to check if room name was provided.
 *
 * @param {(string|undefined)} roomName - Name of the conference room.
 * @returns {boolean}
 */
export function isRoomNameProvided(roomName) {
    return typeof roomName === 'string' && roomName !== '';
}

/**
 * Remove a set of local tracks from a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {Promise}
 */
export function removeLocalTracksFromConference(conference, localTracks) {
    return Promise.all(localTracks.map(track => {
        return conference.removeTrack(track)
            .catch(err => {
                // Local track might be already disposed by direct
                // JitsiTrack#dispose() call. So we should ignore this error
                // here.
                if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                    reportError(
                        'Failed to remove local track from conference',
                        err);
                }
            });
    }));
}

/**
 * Reports a specific Error with a specific error message. While the
 * implementation merely logs the specified msg and err via the console at the
 * time of this writing, the intention of the function is to abstract the
 * reporting of errors and facilitate elaborating on it in the future.
 *
 * @param {string} msg - The error message to report.
 * @param {Error} err - The Error to report.
 * @private
 * @returns {void}
 */
function reportError(msg, err) {
    // TODO This is a good point to call some global error handler when we have
    // one.
    console.error(msg, err);
}