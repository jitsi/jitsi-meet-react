import { ROOM_NAME_SET } from './actionTypes';
import './reducer';

/**
 * Signals that room name was set.
 *
 * @param {string} roomName - Name of conference room.
 * @returns {{
 *      type: ROOM_NAME_SET,
 *      welcome: {
 *          roomName: string
 *      }
 *  }}
 */
export function setRoomName(roomName) {
    return {
        type: ROOM_NAME_SET,
        welcome: {
            roomName
        }
    };
}