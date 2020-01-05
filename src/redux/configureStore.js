import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as actionCreator from './actionCreators';
import * as types from './types';

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            getProductListMiddleware,
            getProductDetailMiddleWare,
            removeEntityMiddleware,
            loadMoreSupplierMiddleware,
            getAllProductCategoriesMiddleware,

            //user related
            performLoginMiddleware,
            performLogoutMiddleware
        )
    );

    return store;
}

const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }

    console.log("---------perform logout------------");
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey':localStorage.getItem("loginKey") }
    })
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {
            let logoutSuccess = false;
            if (responseJson.code == "00") {
                logoutSuccess = true;
            }

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: !logoutSuccess
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));

}

const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {
            'Content-Type': 'application/json',
            'requestId': '1234'
        }
    })
        .then(response => {

            return Promise.all([response.json(), response]);
        })
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
                localStorage.setItem("loginKey", loginKey);
                
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
        .catch(err => console.log(err));

}

const getAllProductCategoriesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_CATEGORIES_ALL) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {  'Content-Type': 'application/json',  'requestId': '1234' }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));

}


const loadMoreSupplierMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.LOAD_MORE_SUPPLIER) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {  'Content-Type': 'application/json', 'requestId': '1234'   }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));

}

const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) {
        return next(action);
    }
    let newAction = Object.assign({}, action, {
        payload: null
    });
    delete newAction.meta;
    store.dispatch(newAction);

}

const getProductDetailMiddleWare = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_DETAIL) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {  'Content-Type': 'application/json',   'requestId': '1234'  }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const getProductListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_LIST) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {  'Content-Type': 'application/json', 'requestId': '1234' }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}
  
export default configureStore;