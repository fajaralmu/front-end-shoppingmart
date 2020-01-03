import * as types from './types'

export const initState = {
    catalogData:{},
    entities: [],
    entity:{
        
    }
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_LIST:
            return { ...state, catalogData: action.payload };
      
        default:
            return state;
    }
}

export default reducer;