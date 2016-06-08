import {
    CLIENT_CREATED
} from '../actions';


export default (state = null, action) {
    switch (action.type) {
        case CLIENT_CREATED:
            return action.client;
        default:
            return state;
    }
}

