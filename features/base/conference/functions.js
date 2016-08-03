import JitsiMeetJS from '../lib-jitsi-meet';

const JitsiTrackErrors = JitsiMeetJS.errors.track;

/**
 * Attach a set of local tracks to a conference.
 *
 * NOTE The function is internal to this feature.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {Promise}
 */
export function _addLocalTracksToConference(conference, localTracks) {
    let conferenceLocalTracks = conference.getLocalTracks();
    let promises = [];

    for (let track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (-1 === conferenceLocalTracks.indexOf(track)) {
            promises.push(conference.addTrack(track)
                .catch(err => {
                    _reportError(
                        'Failed to add local track to conference',
                        err);
                }));
        }
    }

    return Promise.all(promises);
}

/**
 * Determines whether a specific string is a valid room name.
 *
 * @param {(string|undefined)} room - The name of the conference room to check
 * for validity.
 * @returns {boolean} If the specified room name is valid, then true; otherwise,
 * false.
 */
export function isRoomValid(room) {
    return typeof room === 'string' && room !== '';
}

/**
 * Remove a set of local tracks from a conference.
 *
 * NOTE The function is internal to this feature.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {Promise}
 */
export function _removeLocalTracksFromConference(conference, localTracks) {
    return Promise.all(localTracks.map(track => {
        return conference.removeTrack(track)
            .catch(err => {
                // Local track might be already disposed by direct
                // JitsiTrack#dispose() call. So we should ignore this error
                // here.
                if (err.name !== JitsiTrackErrors.TRACK_IS_DISPOSED) {
                    _reportError(
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
 * NOTE The function is internal to this feature.
 *
 * @param {string} msg - The error message to report.
 * @param {Error} err - The Error to report.
 * @private
 * @returns {void}
 */
function _reportError(msg, err) {
    // TODO This is a good point to call some global error handler when we have
    // one.
    console.error(msg, err);
}
