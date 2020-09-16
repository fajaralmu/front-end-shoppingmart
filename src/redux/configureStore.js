import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as actionCreator from './actionCreators';
import * as types from './types';

const commonAuthorizedHeader = () => {
    return {
        'Content-Type': 'application/json', 
        'requestId':  '1234',//'localStorage.getItem("requestId")',
        'loginKey': localStorage.getItem('loginKey')
    }
};
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
            refreshLoginStatusMiddleware,

            //transaction
            getStockInfoMiddleware,
            submitPurchaseTransactionMiddleware,
            submitSupplyTransactionMiddleware,
            resetPurchaseTransactionMiddleware,
            getCustomerListMiddleware,
            getProductListTrxMiddleware,
            getCashflowInfoMiddleware,
            getCashflowDetailMiddleware,
            getProductSalesMiddleware,
            resetProductsMiddleware,
            resetSuppliersMiddleware,
            resetCustomersMiddleware,
            getProductStocksMiddleware,
            resetProductStocksMiddleware,
            getProductSalesDetailMiddleware,
            requestAppIdMiddleware,
            sendChatMessageMiddleware,
            storeChatMessageLocallyMiddleware,
            getMessagesMiddleware,
            updateCartMiddleware,

            /*enntity management*/
            getEntityListMiddleware,
            getEntityByIdMiddleware,
            updateEntityMiddleware,
            removeManagedEntityMiddleware,

            getEntitiesWithCallbackMiddleware

        )
    );

    return store;
}

const getEntitiesWithCallbackMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY_WITH_CALLBACK) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }

            action.meta.callback(data, action.meta.referer);

            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const updateEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_ENTITY) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response updateEntityMiddleware:", data);
            if (data.code != "00") {
                alert("Error Update Entity!");
                return;
            }
            alert("Update Success!");
            const callback = action.meta.callback;
            const referer = action.meta.referer;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
            callback(referer);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getEntityByIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY_BY_ID) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
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
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getEntityListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null ) {
                data.entities = [];
            }
            data.entityConfig = action.meta.entityConfig;
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getMessagesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_MESSAGE) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId") }
    }).then(response => response.json())
        .then(data => {
            console.debug("sendChatMessageMiddleware Response:", data);
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const sendChatMessageMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SEND_MESSAGE) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId") }
    }).then(response => response.json())
        .then(data => {
            console.debug("sendChatMessageMiddleware Response:", data);
            data.username = action.payload.username;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const updateCartMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_CART) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

const storeChatMessageLocallyMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.STORE_MESSAGE) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

const removeManagedEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_MANAGED_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

const requestAppIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REQUEST_ID) { return next(action); }

    let headers = commonAuthorizedHeader();
    const loginKey = localStorage.getItem("loginKey");
    if (loginKey) {
        headers['loginKey'] = loginKey;
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    }).then(response => response.json())
        .then(data => {
            console.debug("requestAppIdMiddleware Response:", data);
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

const getProductStocksMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_PRODUCT_STOCKS) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader(),
    }).then(response => response.json())
        .then(data => {
            console.debug("getProductStocksMiddleware Response:", data, "load more:", action.meta.loadMore);
            if (data.code != "00") {
                alert("Data not found");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getProductSalesDetailMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_PRODUCT_SALES_DETAIL) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("getProductSalesDetailMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getProductSalesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_PRODUCT_SALES) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("getProductSalesMiddleware Response:", data, "load more:", action.meta.loadMore);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data, loadMore: action.meta.loadMore, referrer: action.meta.referrer });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.referrer.props.app.endLoading());
}

const getCashflowDetailMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_DETAIL) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("getCashflowDetailMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getCashflowInfoMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_INFO) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    }).then(response => response.json())
        .then(data => {
            console.debug("getCashflowInfoMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            if (data.entity == null) {
                alert("Data for cashflow: " + action.payload.filter.module + " in " + action.payload.filter.month + "/" + action.payload.filter.year + " period not found!");
                return;
            }

            if (data.entity.amount == null) {
                data.entity.amount = 0;
                data.entity.count = 0;
                console.log("DATA:", data);
            }
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
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
            method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
        })
            .then(response => response.json())
            .then(data => {
                console.debug("getProductListTrxMiddleware Response:", data);
                if (data.entities == null || data.entities.length == 0) {
                    alert("Data not found!");
                    return;
                }
                let newAction = Object.assign({}, action, { payload: data });
                delete newAction.meta;
                store.dispatch(newAction);
            })
            .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
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
            headers: commonAuthorizedHeader()
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
            .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const resetProductStocksMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_PRODUCT_STOCKS) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);
}

const resetCustomersMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_CUSTOMERS) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);
}

const resetProductsMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_PRODUCTS) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);
}
const resetSuppliersMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_SUPPLIERS) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);
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
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
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
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}


const submitPurchaseTransactionMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SUBMIT_TRX_PURCHASE) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
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
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getStockInfoMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_STOCK_INFO) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
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
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getSupplierListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_SUPPLIER_LIST) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
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
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const performLogoutMiddleware = store => next => action => {
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

const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
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
        .finally(param => app.endLoading());

}

const refreshLoginStatusMiddleware = store => next => action => {
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
            requestId: '1234', //TODO: no hard code
        }
    });
    delete newAction.meta;
    store.dispatch(newAction);

}

const getAllProductCategoriesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_CATEGORIES_ALL) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
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
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data, referrer: action.meta.referrer
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(parap => action.meta.referrer.props.app.endLoading());

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
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
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
        .catch(err => console.log(err))
        .finally(param => app.endLoading());
}

const getProductListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_LIST) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
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
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

export default configureStore;