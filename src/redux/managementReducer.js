import * as types from './types'

export const initState = {

    entitiesData: {
        entityConfig: null,
    },
    managedEntity: null

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_ENTITY:

            return { ...state, entitiesData: action.payload };
        case types.GET_ENTITY_BY_ID:

            return { ...state, managedEntity: action.payload.entities[0] };
        default:
            return state;
    }
}

export default reducer;