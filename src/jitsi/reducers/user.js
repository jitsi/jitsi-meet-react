import {
    UPDATE_PROFILE 
} from '../actions';


const initial = {
    name: '',
    gravatar: ''
};


export default function (state = initial, action) {
    switch (action.type) {
        case UPDATE_PROFILE:
            return { ...state, ...action.profile};
        default:
            return state;
    }
}

