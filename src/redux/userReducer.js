import * as types from './types'
import * as menus from '../utils/HardCodedEntites'
import * as menuCodes from '../constant/Menus'

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menus.menus,
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
        case types.REQUEST_ID:
            result = { ...state, requestId: action.payload.message, applicationProfile: action.payload.applicationProfile };
            console.log("APP PROFILE: ",result.applicationProfile);
            localStorage.setItem('requestId', result.requestId);
            if (action.payload.loggedIn != true) {

                result.loginStatus = false;
                result.loggedUser = null;

            } else {

                if (action.payload.sessionData) {

                    result.loggedUser = action.payload.sessionData.user;
                    result.loginStatus = action.payload.loggedIn;
                    result.loginKey= localStorage.getItem('loginKey');
                    localStorage.setItem("loggedUser", JSON.stringify(result.loggedUser));
                }
            }
            

            console.log("o o o result.loginStatus:", result.loginStatus)
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
                localStorage.setItem("loginKey", result.loginKey);
                localStorage.setItem("loggedUser", JSON.stringify(result.loggedUser));
            }

            console.log("logged user: ", result.loggedUser);
            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: null
            };
            localStorage.removeItem("loginKey");
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
        default:
            if (action.payload && action.payload.loginStatus != null)
                return { ...state, menus: updatedMenus };
            else {
                return { ...state };
            }
    }
}

export default reducer;