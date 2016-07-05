import { leave } from '../conference';
import { disconnect } from '../connection';

/**
 * Leaves the conference and closes the connection.
 *
 * @returns {Function}
 */
export function hangup() {
    return dispatch => {
        return dispatch(leave())
            .then(() => dispatch(disconnect()));
    };
}