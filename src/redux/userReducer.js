import * as types from './types'
import * as menus from '../utils/HardCodedEntites'
import * as menuCodes from '../constant/Menus'
import { initialState } from './reducers';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menus.menus,
    loggedUser: null,
    loginAttempt: false
};

export const reducer = (state = initState, action) => {
    console.log("LOGIN STATUS", initialState)
    /*
        ========setting menu========
    */
    let updatedMenus = new Array();
    if (action.payload) {

        let loggedIn = action.payload && action.payload.loginStatus == true;
        for (let index = 0; index < menus.menus.length; index++) {
            const menu = menus.menus[index];
            if (loggedIn && menu.code == menuCodes.LOGIN) { continue; }

            if (menu.authenticated == false) {
                updatedMenus.push(menu);
            } else {
                if (loggedIn) { updatedMenus.push(menu); }
            }
        }
    }

    switch (action.type) {
        case types.DO_LOGIN:
            let result = {
                ...state,
                loginAttempt:true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser
            };
            console.log("logged user: ",result.loggedUser);
            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: null
            };
            return result;
        default:
            if (action.payload && action.payload.loginStatus != null)
                return { ...state, menus: updatedMenus };
            else {
                return { ...state };
            }
    }
}

export default reducer;