import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";

export const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {

            let loginKey = "";
            let loginSuccess = false;

            if (responseJson.code != null && responseJson.code == "00") {
                for (var pair of response.headers.entries()) {
                    if (pair[0] == "loginkey") {
                        loginKey = pair[1];
                        break;
                    }
                }
                console.log("loginKey: ", loginKey);
                loginSuccess = true;

            }
            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: loginSuccess,
                    loginKey: loginKey,
                    loggedUser: responseJson.entity
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => {
            app.endLoading();  
        });

}

export const requestAppIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REQUEST_ID) { return next(action); }

    let headers = common.commonAuthorizedHeader(); 

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    }).then(response => response.json())
        .then(data => {
            console.debug("Request App Id Middleware Response:", data);
            
            if (data.code != "00") {
                alert("Error requesting app ID");
                return;
            }

            let newAction = Object.assign({}, action, { payload: {loginStatus: data.loggedIn, ...data }});
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

export const getLoggedUserMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_LOGGED_USER) { return next(action); }

    let headers = common.commonAuthorizedHeader(); 

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    }).then(response => response.json())
        .then(data => {
            console.debug("getLoggedUserMiddleware Response:", data);
            
            if (!data) {
                alert("Error performing request");
                return;
            }

            let newAction = Object.assign({}, action, { payload: { data }});
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param =>{ 
            action.meta.app.endLoading();
            action.meta.app.refresh();
        });
}

export const refreshLoginStatusMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REFRESH_LOGIN) {
        return next(action);
    }

    let loggedUser = null;
    if (localStorage.getItem("loggedUser")) {
        loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    }

    let newAction = Object.assign({}, action, {
        payload: {
            loginStatus: loggedUser ? true : false,
            loginKey: localStorage.getItem("loginKey"),
            loggedUser: loggedUser,
            requestId: common.getRequestId(), //TODO: no hard code
        }
    });
    delete newAction.meta;
    store.dispatch(newAction);

}

export const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }
    const app = action.meta.app;

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    })
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {
            let logoutSuccess = false;
            if (responseJson.code == "00") {
                logoutSuccess = true;
            }else{
                alert("Logout Failed");
            }

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: !logoutSuccess
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => app.endLoading());

}