import * as types from './types'

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.DO_LOGIN:
            let result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false
            };
            return result;
        default:
            return state;
    }
}

export default reducer;