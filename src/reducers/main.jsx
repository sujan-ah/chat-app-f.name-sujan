import { combineReducers } from 'redux'
import * as actiontype from '../actions/type'


// ==================> user_reducer <=========================================//


const initialstate = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialstate, action)=>{
    switch(action.type){
        case actiontype.SET_USER:
        return{
            currentUser: action.payload.currentUser,
            isLoading: false
        }
        case actiontype.CLEAR_USER:
            return{
                ...initialstate
            }
        default: 
        return state
    }
}


// ==================> group_reducer <=========================================//


const initialstategroup = {
    currentGroup: null
}

const group_reducer = (state = initialstategroup, action)=>{
    switch(action.type){
        case actiontype.SET_CURRENT_GROUP:
        return{
            ...state,
            currentGroup: action.payload.currentgroup
        }
        default:
        return state
    }
}

// ==================> suser_reducer <=========================================//


const initialsinglestate = {
    currentSuser: null,
}

const suser_reducer = (state = initialsinglestate, action)=>{
    switch(action.type){
        case actiontype.SET_SINGLE_USER:
        return{
            ...state,
            currentSuser: action.payload.currentSuser,
        }
        default: 
        return state
    }
}


const rootReducer = combineReducers({
    user : user_reducer,
    group: group_reducer,
    suser: suser_reducer
})

export default rootReducer;