import * as types from './types'
const apiBaseUrl = "http://localhost:8080/universal-good-shop/api/public/"
const apiEntityBaseUrl = "http://localhost:8080/universal-good-shop/api/entity/"
const apiAccount = "http://localhost:8080/universal-good-shop/api/account/"
const apiTransaction = "http://localhost:8080/universal-good-shop/api/transaction/";

export const getCashflowInfo = (month, year, type) => {
    console.log("getCashflowInfo:",type)
    let requested = {
        type: types.GET_CASHFLOW_INFO,
        payload: { filter: { year: year, month: month, module: type } },
        meta: {
            type: types.GET_CASHFLOW_INFO, url: apiTransaction.concat("cashflowinfo")
        }
    };
    return requested;
}

export const getProductListTrx = (name) => ({
    type: types.FETCH_PRODUCT_LIST_TRX,
    payload: {
        entity: "product", filter: { page: 0, limit: 10, fieldsFilter: { name: name } }
    },
    meta: {
        type: types.FETCH_PRODUCT_LIST, url: apiEntityBaseUrl.concat("get")
    }
})
export const getCustomerList = (name) => ({
    type: types.FETCH_CUSTOMER_LIST,
    payload: {
        entity: "customer", filter: { page: 0, limit: 10, fieldsFilter: { name: name } }
    },
    meta: {
        type: types.FETCH_CUSTOMER_LIST, url: apiEntityBaseUrl.concat("get")
    }
})

export const resetPurchaseTransaction = () => ({
    type: types.RESET_TRX_PURCHASE,
    payload: {},
    meta: { type: types.RESET_TRX_PURCHASE }
})
export const submitPurchaseTransaction = (request) => {
    console.log("Submit Supply Purchase...")
    let requested = {
        type: types.SUBMIT_TRX_PURCHASE,
        payload: {
            customer: request.customer,
            productFlows: request.productFlows
        },
        meta: {
            type: types.SUBMIT_TRX_PURCHASE, url: apiTransaction.concat("purchase")
        }
    };
    return requested;
}
export const submitSupplyTrx = (request) => {
    console.log("Submit Supply Trx...")
    let requested = {
        type: types.SUBMIT_TRX_SUPPLY,
        payload: {
            supplier: request.supplier,
            productFlows: request.productFlows
        },
        meta: {
            type: types.SUBMIT_TRX_SUPPLY, url: apiTransaction.concat("supply")
        }
    };
    return requested;
}

export const getStockInfo = (stockId) => ({
    type: types.GET_STOCK_INFO,
    payload: { productFlow: { id: stockId } },
    meta: {
        type: types.GET_STOCK_INFO, url: apiTransaction.concat("stockinfo")
    }
})

export const performLogout = () => {
    let loginRequest = {
        type: types.DO_LOGOUT,
        payload: {},
        meta: { type: types.DO_LOGOUT, url: apiAccount.concat("logout") }
    };
    return loginRequest;
}

export const performLogin = (username, password) => {
    let loginRequest = {
        type: types.DO_LOGIN,
        payload: {
            user: { username: username, password: password }
        },
        meta: { type: types.DO_LOGIN, url: apiAccount.concat("login") }
    };
    return loginRequest;
}

export const getAllProductCategories = () => ({
    type: types.FETCH_PRODUCT_CATEGORIES_ALL,
    payload: {
        entity: "category",
        filter: {
            limit: 0,
            page: 0,
            orderBy: null,
            orderType: null,
            fieldsFilter: {}
        }
    },
    meta: {
        type: types.FETCH_PRODUCT_CATEGORIES_ALL,
        url: apiEntityBaseUrl.concat("get")
    }
})

export const getSupplierList = (request) => {
    let requested = {
        type: types.FETCH_SUPPLIER_LIST,
        payload: {
            entity: "supplier",
            filter: {
                limit: 10,
                page: request.page,
                fieldsFilter: {
                    name: request.name
                },
                orderBy: request.orderby,
                orderType: request.ordertype
            }
        },
        meta: {
            type: types.FETCH_SUPPLIER_LIST,
            url: apiBaseUrl.concat("get")
        }
    };

    if (request.categoryId != null) {
        requested.payload.filter.fieldsFilter["category,id[EXACTS]"] = request.categoryId;
    }

    return requested;
}

export const getProductList = (request) => {

    let requested = {
        type: types.FETCH_PRODUCT_LIST,
        payload: {
            entity: "product",
            filter: {
                limit: 10,
                page: request.page,
                fieldsFilter: {
                    name: request.name,
                    withStock: false
                },
                orderBy: request.orderby,
                orderType: request.ordertype
            }
        },
        meta: {
            type: types.FETCH_PRODUCT_LIST,
            url: apiBaseUrl.concat("get")
        }
    };

    if (request.categoryId != null) {
        requested.payload.filter.fieldsFilter["category,id[EXACTS]"] = request.categoryId;
    }

    return requested;
}


export const getProductDetail = (code) => ({
    type: types.FETCH_PRODUCT_DETAIL,
    payload: {

        entity: "product",
        filter: {
            limit: 1,
            exacts: true,
            contains: false,
            fieldsFilter: {
                code: code,
                withStock: true,
                withSupplier: true
            }
        }
    },
    meta: {
        type: types.FETCH_PRODUCT_DETAIL,
        url: apiBaseUrl.concat("get")
    }
})

export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})

export const loadMoreSupplier = (page, productId) => ({
    type: types.LOAD_MORE_SUPPLIER,
    payload: { filter: { page: page, fieldsFilter: { "productId": productId } } },
    meta: {
        type: types.LOAD_MORE_SUPPLIER,
        url: apiBaseUrl.concat("moresupplier")
    }
})

