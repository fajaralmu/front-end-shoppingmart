import * as types from './types'
import { nullLiteral } from '@babel/types';

export const initState = {
    productFlowStock: null,
    transactionData: null,
    successTransaction: false,
    customersData: null,
    productsData: null,
    cashflowInfoOut: null,
    cashflowInfoIn: null
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_STOCK_INFO:
            let result = { ...state, productFlowStock: action.payload };
            return result;
        case types.SUBMIT_TRX_PURCHASE:
            return { ...state, transactionData: action.payload.transaction, successTransaction: true };
        case types.SUBMIT_TRX_SUPPLY:
            return { ...state, transactionData: action.payload.transaction, successTransaction: true };
        case types.RESET_TRX_PURCHASE:
            return initState;
        case types.FETCH_CUSTOMER_LIST:
            result = { ...state, customersData: action.payload.entities };
            return result;
        case types.FETCH_PRODUCT_LIST_TRX:
            result = { ...state, productsData: action.payload.entities };
            return result;
        case types.GET_CASHFLOW_INFO:
            result = state;
            if (action.payload.module == "OUT")
                result.cashflowInfoOut = action.payload;
            if (action.payload.module == "IN")
                result.cashflowInfoIn = action.payload;
            return result;
        default:
            return { ...state };
    }
}

export default reducer;