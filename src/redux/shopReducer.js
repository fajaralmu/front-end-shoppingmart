import * as types from './types'

export const initState = { 
    entities: [],
    entity: {},
    categories: [],
    suppliersData: [],
    requestId: null,
    messages: null,
    userAlias: "anonymous_" + new Date().getTime(),
    cart: [],
    productsSupplied: []

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
         
      
        case types.REMOVE_SHOP_ENTITY:
            return { ...state, entity: action.payload  /*null*/ };
        case types.FETCH_SUPPLIER_LIST:
            return { ...state, suppliersData: action.payload };
        case types.FETCH_PRODUCT_SUPPLIED:
            return { ...state, productsSupplied: action.payload.entities };
        case types.REMOVE_PRODUCT_SUPPLIED:
            return { ...state, productsSupplied: [] };
        case types.RESET_SUPPLIERS:
            return { ...state, suppliersData: {} };
        
        case types.FETCH_PRODUCT_CATEGORIES_ALL:
            return { ...state, categories: action.payload.entities };
        // case types.REQUEST_ID:

        //     return { ...state, requestId: action.payload.message };
        case types.SEND_MESSAGE:
            return { ...state, messages: action.payload.entities, userAlias: action.payload.username };
        case types.STORE_MESSAGE:
            return { ...state, messages: action.payload.entities };
        case types.GET_MESSAGE:
            return { ...state, messages: action.payload.entities };
        case types.UPDATE_CART:
            if (action.payload.app) {
                action.payload.app.refresh();
            }
            return { ...state, cart: action.payload.cart };

       
        default:
            return state;
    }
}

export default reducer;