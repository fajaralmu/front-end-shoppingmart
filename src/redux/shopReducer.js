import * as types from './types'

export const initState = {
    catalogData: {},
    entities: [],
    entity: {

    }
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_LIST:
            return { ...state, catalogData: action.payload };
        case types.FETCH_PRODUCT_DETAIL:
            return { ...state, entity: action.payload.entities[0] };
        case types.REMOVE_SHOP_ENTITY:
                return { ...state, entity: action.payload /*null*/};
        default:
            return state;
    }
}

export default reducer;