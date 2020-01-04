import * as shopReducer from "./shopReducer"
import * as userReducer from "./userReducer"

import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        shopState : shopReducer.reducer,
        userState : userReducer.reducer
    }
);

export const initialState = {
    shopState : shopReducer.initState,
    userState : userReducer.initState
}

export default rootReducer;