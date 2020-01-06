import * as types from './types'

export const initState = {
    productFlowStock: null,
    transactionData: null,
    successTransaction: false,
    customersData: null
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_STOCK_INFO:
            let result = { ...state, productFlowStock: action.payload };
            return result;
        case types.SUBMIT_TRX_PURCHASE:
            return { ...state, transactionData: action.payload.transaction, successTransaction: true };
        case types.RESET_TRX_PURCHASE:
            return initState;
        case types.FETCH_CUSTOMER_LIST:
             result = { ...state, customersData: action.payload.entities };
            return result;
        default:
            return { ...state };
    }
}

export default reducer;