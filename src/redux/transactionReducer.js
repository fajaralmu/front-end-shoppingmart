import * as types from './types'
import * as menus from '../utils/HardCodedEntites'
import * as menuCodes from '../constant/Menus'
import { initialState } from './reducers';

export const initState = {
    productFlowStock: null,
    transactionData: null
};

export const reducer = (state = initState, action) => {  
    switch (action.type) { 
        case types.GET_STOCK_INFO:
            let result = {  ...state,   productFlowStock: action.payload  };
            return result;
        case types.SUBMIT_TRX_PURCHASE:
            return  { ...state, transactionData: action.payload.transaction }; 
        default:
            return { ...state }; 
    }
}

export default reducer;