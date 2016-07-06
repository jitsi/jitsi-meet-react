// TODO: this is temporary until PR #36 is merged. After that import "store".
/* global store */

import JitsiMeetJS from '../lib-jitsi-meet';

import {
    createLocalTracks,
    DEVICE_TYPE
} from '../tracks';

import {
    cameraDisabledStateChanged,
    microphoneDisabledStateChanged
} from './actions';

import { DEVICE_KIND } from './constants';

/**
 * Determines if currently selected audio output device should be changed after
 * list of available devices has been changed.
 * 
 * @param {MediaDeviceInfo[]} newDevices - List of new devices.
 * @returns {string|undefined} - ID of new audio output device to use, undefined
 *      if audio output device should not be changed.
 */
function getNewAudioOutputDevice(newDevices) {
    if (!JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
        return;
    }

    // TODO: this should be taken from settings
    let selectedAudioOutputDeviceId =
        store.getState()['features/base/media'].audioOutput.deviceId;
    let availableAudioOutputDevices = newDevices.filter(
        d => d.kind === DEVICE_KIND.AUDIO_OUTPUT);

    // Switch to 'default' audio output device if we don't have the selected one
    // available anymore.
    if (selectedAudioOutputDeviceId !== 'default' &&
        !availableAudioOutputDevices.find(d =>
            d.deviceId === selectedAudioOutputDeviceId)) {
        return 'default';
    }
}

/**
 * Determines if currently selected audio input device should be changed after
 * list of available devices has been changed.
 *
 * @param {MediaDeviceInfo[]} newDevices - List of new devices.
 * @param {JitsiLocalTrack} localAudio - Local audio track.
 * @returns {string|undefined} - ID of new microphone device to use, undefined
 *      if audio input device should not be changed.
 */
function getNewAudioInputDevice(newDevices, localAudio) {
    let availableAudioInputDevices = newDevices.filter(
        d => d.kind === DEVICE_KIND.AUDIO_INPUT);
    // TODO: this should be taken from settings
    let selectedAudioInputDeviceId =
        store.getState()['features/base/media'].microphone.deviceId;
    let selectedAudioInputDevice = availableAudioInputDevices.find(
        d => d.deviceId === selectedAudioInputDeviceId);

    // Here we handle case when no device was initially plugged, but
    // then it's connected OR new device was connected when previous
    // track has ended.
    if (!localAudio || localAudio.disposed || localAudio.isEnded()) {
        // If we have new audio device and permission to use it was granted
        // (label is not an empty string), then we will try to use the first
        // available device.
        if (availableAudioInputDevices.length &&
            availableAudioInputDevices[0].label !== '') {
            return availableAudioInputDevices[0].deviceId;
        }
        // Otherwise we assume that we don't have any audio input devices
        // to use and that's why disable microphone button on UI.
        else {
            store.dispatch(microphoneDisabledStateChanged(true));
        }
    } else {
        // And here we handle case when we already have some device working,
        // but we plug-in a "preferred" (previously selected in settings, stored
        // in local storage) device.
        if (selectedAudioInputDevice &&
            selectedAudioInputDeviceId !== localAudio.getDeviceId()) {
            return selectedAudioInputDeviceId;
        }
    }
}

/**
 * Determines if currently selected video input device should be changed after
 * list of available devices has been changed.
 *
 * @param {MediaDeviceInfo[]} newDevices - List of new devices.
 * @param {JitsiLocalTrack} localVideo - Local video track.
 * @returns {string|undefined} - ID of new camera device to use, undefined
 *      if video input device should not be changed.
 */
function getNewVideoInputDevice(newDevices, localVideo) {
    let availableVideoInputDevices = newDevices.filter(
        d => d.kind === DEVICE_KIND.VIDEO_INPUT);
    // TODO: this should be taken from settings
    let selectedVideoInputDeviceId =
        store.getState()['features/base/media'].camera.deviceId;
    let selectedVideoInputDevice = availableVideoInputDevices.find(
        d => d.deviceId === selectedVideoInputDeviceId);

    // Here we handle case when no video input device was initially plugged,
    // but then device is connected OR new device was connected when
    // previous track has ended.
    if (!localVideo || localVideo.disposed || localVideo.isEnded()) {
        // If we have new video device and permission to use it was granted
        // (label is not an empty string), then we will try to use the first
        // available device.
        if (availableVideoInputDevices.length &&
            availableVideoInputDevices[0].label !== '') {
            return availableVideoInputDevices[0].deviceId;
        }
        // Otherwise we assume that we don't have any video input devices
        // to use and that's why disable microphone button on UI.
        else {
            store.dispatch(cameraDisabledStateChanged(true));
        }
    } else {
        // And here we handle case when we already have some device working,
        // but we plug-in a "preferred" (previously selected in settings, stored
        // in local storage) device.
        if (selectedVideoInputDevice &&
            selectedVideoInputDeviceId !== localVideo.getDeviceId()) {
            return selectedVideoInputDeviceId;
        }
    }
}

export default {
    /**
     * Returns list of devices of single kind.
     *
     * @param {MediaDeviceInfo[]} devices - List of devices.
     * @param {DEVICE_KIND} kind - Kind of device to get.
     * @returns {MediaDeviceInfo[]}
     */
    getDevicesFromListByKind(devices, kind) {
        return devices.filter(d => d.kind === kind);
    },

    /**
     * Returns lists of current 'audioinput', 'videoinput' and 'audiooutput'
     * devices.
     *
     * @returns {{
     *  audioinput: (MediaDeviceInfo[]|undefined),
     *  videoinput: (MediaDeviceInfo[]|undefined),
     *  audiooutput: (MediaDeviceInfo[]|undefined),
     *  }}
     */
    getCurrentMediaDevicesByKind() {
        let devices = store.getState()['features/base/media'].devices;

        return {
            audioinput: devices
                ? this.getDevicesFromListByKind(
                    devices, DEVICE_KIND.AUDIO_INPUT)
                : undefined,
            videoinput: devices
                ? this.getDevicesFromListByKind(
                    devices, DEVICE_KIND.VIDEO_INPUT)
                : undefined,
            audiooutput: devices
                ? this.getDevicesFromListByKind(
                    devices, DEVICE_KIND.AUDIO_OUTPUT)
                : undefined
        };
    },

    /**
     * Determines if currently selected media devices should be changed after
     * list of available devices has been changed.
     *
     * @param {MediaDeviceInfo[]} newDevices - New list of devices.
     * @returns {{
     *  audioinput: (string|undefined),
     *  videoinput: (string|undefined),
     *  audiooutput: (string|undefined)
     *  }}
     */
    getNewMediaDevicesAfterDeviceListChanged(newDevices) {
        let tracks = store.getState()['features/base/tracks'];
        let localAudio = tracks.find(t => t.isLocal() && t.isAudioTrack());
        let localVideo = tracks.find(t => t.isLocal() && t.isVideoTrack());

        // TODO: get this from state!!!
        let isSharingScreen = false;

        return {
            audioinput: getNewAudioInputDevice(newDevices, localAudio),
            videoinput: !isSharingScreen &&
                getNewVideoInputDevice(newDevices, localVideo),
            audiooutput: getNewAudioOutputDevice(newDevices)
        };
    },

    /**
     * Tries to create new local tracks for new devices obtained after device
     * list changed. Shows error dialog in case of failures.
     *
     * @param {string} (cameraDeviceId) - Camera device ID.
     * @param {string} (micDeviceId) - Microphone device ID.
     * @returns {Promise.<JitsiLocalTrack[]>}
     */
    createLocalTracksAfterDeviceListChanged(cameraDeviceId, micDeviceId) {
        let audioTrackError;
        let videoTrackError;
        let audioRequested = !!micDeviceId;
        let videoRequested = !!cameraDeviceId;

        if (audioRequested && videoRequested) {
            // First we try to create both audio and video tracks together.
            return createLocalTracks({
                devices: [ DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO ],
                cameraDeviceId: cameraDeviceId,
                micDeviceId: micDeviceId
            })
            // If we fail to do this, try to create them separately.
            .catch(() => Promise.all([
                createAudioTrack(false).then(([stream]) => stream),
                createVideoTrack(false).then(([stream]) => stream)
            ]))
            .then(tracks => {
                if (audioTrackError || videoTrackError) {
                    // TODO: show error dialog
                    // APP.UI.showDeviceErrorDialog(
                    //     audioTrackError, videoTrackError);
                }

                return tracks.filter(t => typeof t !== 'undefined');
            });
        } else if (videoRequested && !audioRequested) {
            return createVideoTrack();
        } else if (audioRequested && !videoRequested) {
            return createAudioTrack();
        } else {
            return Promise.resolve([]);
        }

        /**
         * Internal function to create audio track.
         *
         * @param {boolean} [showError] - If error dialog should be shown.
         * @returns {Promise.<JitsiLocalTrack[]>}
         */
        function createAudioTrack(showError) {
            return createLocalTracks({
                devices: [ DEVICE_TYPE.AUDIO ],
                cameraDeviceId: null,
                micDeviceId: micDeviceId
            })
            .catch(err => {
                audioTrackError = err;

                if (showError) {
                    // TODO: show error dialog
                    //APP.UI.showDeviceErrorDialog(err, null);
                }

                return [];
            });
        }

        /**
         * Internal function to create video track.
         *
         * @param {boolean} [showError] - If error dialog should be shown.
         * @returns {Promise.<JitsiLocalTrack[]>}
         */
        function createVideoTrack(showError) {
            return createLocalTracks({
                devices: [ DEVICE_TYPE.VIDEO ],
                cameraDeviceId: cameraDeviceId,
                micDeviceId: null
            })
            .catch(err => {
                videoTrackError = err;

                if (showError) {
                    // TODO: show error dialog
                    //APP.UI.showDeviceErrorDialog(null, err);
                }

                return [];
            });
        }
    }
};