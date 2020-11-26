import * as types from './types' 
import * as menuData from '../constant/Menus'
import { setCookie } from '../middlewares/Common';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menuData.menus,
    loggedUser: null,
    loginAttempt: false,
    requestId: null,
    applicationProfile: {},
};

export const reducer = (state = initState, action) => {
    /*
        ========setting menu========
    */
    let updatedMenus = new Array();
    if (action.payload) {

        let loggedIn = action.payload && action.payload.loginStatus == true;
        for (let index = 0; index < menuData.menus.length; index++) {
            const menu = menuData.menus[index];
            if (loggedIn && menu.code == menuData.LOGIN) { continue; }

            if (menu.authenticated == false) {
                updatedMenus.push(menu);
            } else {
                if (loggedIn) { updatedMenus.push(menu); }
            }
        }
    }

    switch (action.type) {
        case types.REQUEST_ID:
            result = { ...state, requestId: action.payload.message, applicationProfile: action.payload.applicationProfile };
            
            setCookie("requestId", result.requestId);
            
            if (action.payload.loggedIn != true) {

                result.loginStatus = false;
                result.loggedUser = null;
                localStorage.removeItem("loginKey");
                localStorage.removeItem("loggedUser");
            } else {

                if (action.payload.sessionData) {

                    result.loggedUser = action.payload.sessionData.user;
                    result.loginStatus = action.payload.loggedIn;
                    result.loginKey = localStorage.getItem('loginKey');
                    localStorage.setItem("loggedUser", JSON.stringify(result.loggedUser));
                }else {
                    result.loginStatus = false;
                    result.loggedUser = null;

                    localStorage.removeItem("loggedUser");
                }
            } 

            console.debug("o o o result.loginStatus:", result.loginStatus)
            //  action.payload.referer.refresh();

            return result;
        case types.DO_LOGIN:
            let result = {
                ...state,
                loginAttempt: true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser
            };

            if (result.loginStatus == true) {
                setCookie("loginKey", result.loginKey);
                // localStorage.setItem("loggedUser", JSON.stringify(result.loggedUser));
            }

            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: null
            };
            
            localStorage.removeItem("loggedUser");
            return result;
        case types.REFRESH_LOGIN:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser,
                requestId: action.payload.requestId,
            };
            return result;
        case types.GET_LOGGED_USER:
            result = {
                ...state,
                loggedUser: action.payload.data
            };
            localStorage.setItem("loggedUser", JSON.stringify(action.payload))
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