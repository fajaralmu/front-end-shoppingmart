import * as types from './types'

export const initState = {
    catalogData: {},
    entities: [],
    entity: {

    },
    suppliers: [

    ]
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_LIST:
            return { ...state, catalogData: action.payload };
        case types.FETCH_PRODUCT_DETAIL:
            return { ...state, entity: action.payload.entities[0] };
        case types.REMOVE_SHOP_ENTITY:
            return { ...state, entity: action.payload, suppliers:[] /*null*/ };
        case types.LOAD_MORE_SUPPLIER:
            let currentProduct = state.entity;
            let loadedSupplier = action.payload.entities ;
            for (let index = 0; index < loadedSupplier.length; index++) {
                currentProduct.suppliers.push( loadedSupplier[index]); 
            }
            console.info("additinal suppliers: ",currentProduct.suppliers);
            return { ...state, entity: currentProduct };
        default:
            return state;
    }
}

export default reducer;