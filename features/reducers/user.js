import {
    UPDATE_PROFILE
} from '../constants';


const initial = {
    name: '',
    gravatar: '',
    speaking: false,
    moderator: false
};


/**
 * Listen for actions that modify the "profile" of the user, such as
 * their name or avatar.
 */
export default function (state = initial, action) {
    switch (action.type) {
        case UPDATE_PROFILE:
            return { ...state, ...action.profile};
        default:
            return state;
    }
}
