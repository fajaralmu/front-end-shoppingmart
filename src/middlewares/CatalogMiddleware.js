import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";
   

export const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) { return next(action); }
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

export const updateCartMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_CART) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

