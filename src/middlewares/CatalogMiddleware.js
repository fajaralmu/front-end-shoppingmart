import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";

export const getProductListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_LIST) {
        return next(action);
    }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            //console.debug("Response:", data);
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

export const getProductDetailMiddleWare = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_DETAIL) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            //console.debug("Response:", data);
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

export const loadMoreSupplierMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.LOAD_MORE_SUPPLIER) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            //console.debug("Response:", data);
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

export const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction); 
}

export const removeProductSuppliedMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_PRODUCT_SUPPLIED) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction); 
}

export const getSupplierListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_SUPPLIER_LIST) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:", data.entities);
            if (data.entities == null || data.entities.length == 0) {
                alert("Supplier not found!");
                return;
            }
            let newAction = Object.assign({}, action, {  payload: data  });
            delete newAction.meta;
            store.dispatch(newAction);
            if(action.meta.callback){
                action.meta.callback(data);
            }
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}
 

export const getProductSuppliedMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_SUPPLIED) { return next(action); }

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            //console.debug("Response:", data);
            if (data.entities == null) {
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


export const getAllProductCategoriesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_CATEGORIES_ALL) {
        return next(action);
    }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(data => {
            //console.debug("Response:", data);
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

}

export const updateCartMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_CART) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

