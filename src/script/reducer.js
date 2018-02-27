
import {SET_TOKEN} from './action';

export const token = function (state='',action){
    switch(action.type){
        case SET_TOKEN:
            return action.state;
        default:
            return state;
    }
}

