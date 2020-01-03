import * as shopReducer from "./shopReducer"

import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        shopState : shopReducer.reducer,
       
    }
);

export const initialState = {
    shopState : shopReducer.initState,
    // examsState : examReducer.initState
}

export default rootReducer;