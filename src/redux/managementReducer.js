import * as types from './types'

export const initState = {
    
    entitiesData: {
        entityConfig:null
    }

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_ENTITY:
           
            return { ...state, entitiesData: action.payload };
       
        default:
            return state;
    }
}

export default reducer;