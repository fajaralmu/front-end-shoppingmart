import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as types from './types';
import * as userMiddleware from '../middlewares/UserMiddleware'
import * as managementMiddleware from '../middlewares/ManagementMiddleware'
import * as realtimeChatMiddleware from '../middlewares/RealtimeChatMiddleware'
import * as catalogMiddleware from '../middlewares/CatalogMiddleware'
import * as common from '../middlewares/Common';

const commonAuthorizedHeader = () => {
   return common.commonAuthorizedHeader(); 
};
const POST_METHOD = "POST";

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(  
            catalogMiddleware.removeEntityMiddleware, 
            catalogMiddleware.getAllProductCategoriesMiddleware,
            catalogMiddleware.getSupplierListMiddleware,
            catalogMiddleware.updateCartMiddleware, 

            //user related
            userMiddleware.performLoginMiddleware,
            userMiddleware.performLogoutMiddleware,
            userMiddleware.refreshLoginStatusMiddleware,
            userMiddleware.requestAppIdMiddleware, 
            userMiddleware.getLoggedUserMiddleware, 

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

            /*enntity management*/
            managementMiddleware.getEntityListMiddleware,
            managementMiddleware.getEntityByIdMiddleware,
            managementMiddleware.updateEntityMiddleware,
            managementMiddleware.removeManagedEntityMiddleware, 
            managementMiddleware.getEntitiesWithCallbackMiddleware,
            managementMiddleware.getEntityPropertyMiddleware,
            managementMiddleware.getManagementMenusMiddleware,

            /*realtime chat*/
            realtimeChatMiddleware.sendChatMessageMiddleware,
            realtimeChatMiddleware.storeChatMessageLocallyMiddleware,
            realtimeChatMiddleware.getMessagesMiddleware,

        )
    );

    return store;
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
    })
    .then(response => response.json())
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
        headers: commonAuthorizedHeader()
    })
    .then(response => response.json())
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
    
    if (isEmptyObject(action.payload.filter.fieldsFilter)) {
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
                 
                if(action.meta.callback) {
                    action.meta.callback(data);
                }

                let newAction = Object.assign({}, action, { payload: data });
                delete newAction.meta;
                store.dispatch(newAction);
            })
            .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const isEmptyObject = (object) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            if(element!=null || element.toString().trim() != ""){
                return false;
            }
        }
    }
    return true;
}

const getCustomerListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_CUSTOMER_LIST) { return next(action); }

    if (isEmptyObject(action.payload.filter.fieldsFilter)) {
        let newAction = Object.assign({}, action, {
            payload: { entities: [] }
        });
        delete newAction.meta;
        store.dispatch(newAction);
    } else {
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
            
            if(action.meta.callback){
                action.meta.callback(data);
            }
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
    }
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
    if (!action.meta || action.meta.type !== types.RESET_TRX_SELLING_PURCHASING) { return next(action); }
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
 

export default configureStore;