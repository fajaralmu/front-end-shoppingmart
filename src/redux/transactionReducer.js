import * as types from './types'
import { nullLiteral } from '@babel/types';

export const initState = {
    productFlowStock: null,
    transactionData: null,
    successTransaction: false,
    customersData: null,
    productsData: null,
    cashflowInfoOut: null,
    cashflowInfoIn: null,
    cashflowDetail: null
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
            return {
                ...state, productFlowStock: null,
                transactionData: null, successTransaction: false,
                customersData: null, productsData: null
            };

        case types.FETCH_CUSTOMER_LIST:
            return { ...state, customersData: action.payload.entities };

        case types.FETCH_PRODUCT_LIST_TRX:
            return { ...state, productsData: action.payload.entities };

        case types.GET_CASHFLOW_INFO:
            result = state;
            if (action.payload.module == "OUT")
                result.cashflowInfoOut = action.payload;
            if (action.payload.module == "IN")
                result.cashflowInfoIn = action.payload;
            return result;

        case types.GET_CASHFLOW_DETAIL: 
            return { ...state, cashflowDetail: action.payload };

        default:
            return { ...state };
    }
}

export default reducer;