import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as actionCreator from './actionCreators';
import * as types from './types';

const commonHeader = { 'Content-Type': 'application/json', 'requestId': '1234' };
const POST_METHOD = "POST";

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
            getSupplierListMiddleware,

            //user related
            performLoginMiddleware,
            performLogoutMiddleware,

            //transaction
            getStockInfoMiddleware,
            submitPurchaseTransactionMiddleware,
            submitSupplyTransactionMiddleware,
            resetPurchaseTransactionMiddleware,
            getCustomerListMiddleware,
            getProductListTrxMiddleware,
            getCashflowInfoMiddleware,
            getCashflowDetailMiddleware

        )
    );

    return store;
}

const getCashflowDetailMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_DETAIL) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if(data.code != "00"){
                alert("Server error");
                return;
            }
 
            let newAction = Object.assign({}, action, { payload: data  });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const getCashflowInfoMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_INFO) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if(data.code != "00"){
                alert("Server error");
                return;
            }

            if (data.entity == null || data.entity.amount == null) {
                alert("Data for cashflow: "+action.payload.filter.module+" in "+action.payload.filter.month+"/"+action.payload.filter.year+" period not found!");
                return;
            }
            let newAction = Object.assign({}, action, { payload: data.entity });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}
 
const getProductListTrxMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_LIST_TRX) { return next(action); }

    if (action.payload.filter.fieldsFilter.name == null || action.payload.filter.fieldsFilter.name.trim() == "") {
        let newAction = Object.assign({}, action, {
            payload: { entities: [] }
        });
        delete newAction.meta;
        store.dispatch(newAction);
    } else
        fetch(action.meta.url, {
            method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonHeader
        })
            .then(response => response.json())
            .then(data => {
                console.debug("Response:", data);
                if (data.entities == null || data.entities.length == 0) {
                    alert("Data not found!");
                    return;
                }
                let newAction = Object.assign({}, action, { payload: data });
                delete newAction.meta;
                store.dispatch(newAction);
            })
            .catch(err => console.log(err));
}

const getCustomerListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_CUSTOMER_LIST) { return next(action); }

    if (action.payload.filter.fieldsFilter.name == null || action.payload.filter.fieldsFilter.name.trim() == "") {
        let newAction = Object.assign({}, action, {
            payload: { entities: [] }
        });
        delete newAction.meta;
        store.dispatch(newAction);
    } else
        fetch(action.meta.url, {
            method: POST_METHOD,
            body: JSON.stringify(action.payload),
            headers: commonHeader
        })
            .then(response => response.json())
            .then(data => {
                console.debug("Response:", data);
                if (data.entities == null || data.entities.length == 0) {
                    alert("Data not found!");
                    return;
                }
                let newAction = Object.assign({}, action, { payload: data });
                delete newAction.meta;
                store.dispatch(newAction);
            })
            .catch(err => console.log(err));
}


const resetPurchaseTransactionMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_TRX_PURCHASE) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);

}

const submitSupplyTransactionMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SUBMIT_TRX_SUPPLY) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.code != "00") {
                alert("Transaction Failed!");
                return;
            }
            alert("Transaction Success!")
            data.transaction.productFlows = action.payload.productFlows;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}


const submitPurchaseTransactionMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SUBMIT_TRX_PURCHASE) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.code != "00") {
                alert("Transaction Failed!");
                return;
            }
            alert("Transaction Success!")
            data.transaction.productFlows = action.payload.productFlows;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const getStockInfoMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_STOCK_INFO) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.productFlowStock == null) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data.productFlowStock
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const getSupplierListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_SUPPLIER_LIST) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonHeader
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

const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }

    console.log("---------perform logout------------");
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': '1234', 'loginKey': localStorage.getItem("loginKey") }
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
        method: POST_METHOD,  body: JSON.stringify(action.payload), headers: commonHeader
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
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonHeader
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
        method: POST_METHOD, body: JSON.stringify(action.payload),  headers: commonHeader
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
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);

}

const getProductDetailMiddleWare = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_DETAIL) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),  headers: commonHeader
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
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonHeader
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