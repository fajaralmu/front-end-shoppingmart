import * as types from './types'
const apiBaseUrl = "http://localhost:8080/universal-good-shop/api/public/"
const apiEntityBaseUrl = "http://localhost:8080/universal-good-shop/api/entity/"
const apiAccount = "http://localhost:8080/universal-good-shop/api/account/"
const apiTransaction = "http://localhost:8080/universal-good-shop/api/transaction/";

export const resetProductStocks = () => {
    return { type: types.RESET_PRODUCT_STOCKS, payload: {}, meta: { type: types.RESET_PRODUCT_STOCKS } };
}

export const resetProducts = () => {
    return { type: types.RESET_PRODUCTS, payload: {}, meta: { type: types.RESET_PRODUCTS } };
}
export const resetSuppliers = () => {
    return { type: types.RESET_SUPPLIERS, payload: {}, meta: { type: types.RESET_SUPPLIERS } };
}
export const resetCustomers = () => {
    return { type: types.RESET_CUSTOMERS, payload: {}, meta: { type: types.RESET_CUSTOMERS } };
}
export const getProductStocks = (name, app) => {
    app.startLoading();
    return {
        type: types.GET_PRODUCT_STOCKS,
        payload: { product:{name:name}},
        meta: {
            app: app, type: types.GET_PRODUCT_STOCKS, 
            url: apiTransaction.concat("stocks")
        }
    };
}

export const getProductSalesDetail = (request, app) => {
    app.startLoading(true);
    return {
        type: types.GET_PRODUCT_SALES_DETAIL,
        payload: {  
            filter:
             { page: request.page, limit: 10, month: request.fromMonth, year: request.fromYear, monthTo: request.toMonth, yearTo: request.toYear } },
        meta: {
            app:app, 
            type: types.GET_PRODUCT_SALES_DETAIL, 
            loadMore: request.loadMore == true, url: apiTransaction.concat("productsalesdetail/"+request.productId)
        }
    };
}

export const getProductSales = (request) => {
    request.referrer.props.app.startLoading(true);
    return {
        type: types.GET_PRODUCT_SALES,
        payload: { 
            product:{name:request.productName},
            filter:
             { page: request.page, limit: 10, month: request.fromMonth, year: request.fromYear, monthTo: request.toMonth, yearTo: request.toYear } },
        meta: {
            referrer: request.referrer, type: types.GET_PRODUCT_SALES, loadMore: request.loadMore == true, url: apiTransaction.concat("productsales")
        }
    };
}
export const getCashflowDetail = (request, app) => {
    app.startLoading(true);
    return {
        type: types.GET_CASHFLOW_DETAIL,
        payload: { filter: { month: request.fromMonth, year: request.fromYear, monthTo: request.toMonth, yearTo: request.toYear } },
        meta: {
            app: app, type: types.GET_CASHFLOW_DETAIL, url: apiTransaction.concat("cashflowdetail")
        }
    };
}
export const getCashflowInfo = (month, year, type, app) => {
    app.startLoading();
    return {
        type: types.GET_CASHFLOW_INFO,
        payload: { filter: { year: year, month: month, module: type } },
        meta: {
            app: app, type: types.GET_CASHFLOW_INFO, url: apiTransaction.concat("cashflowinfo")
        }
    };
}

export const getProductListTrx = (name, app) => {
    app.startLoading();
    return {
        type: types.FETCH_PRODUCT_LIST_TRX,
        payload: {
            entity: "product", filter: { page: 0, limit: 10, fieldsFilter: { name: name } }
        },
        meta: {
            type: types.FETCH_PRODUCT_LIST, url: apiEntityBaseUrl.concat("get"), app: app
        }
    }
}

export const getCustomerList = (name, app) => {
    app.startLoading();
    return {
        type: types.FETCH_CUSTOMER_LIST,
        payload: {
            entity: "customer", filter: { page: 0, limit: 10, fieldsFilter: { name: name } }
        },
        meta: {
            type: types.FETCH_CUSTOMER_LIST, url: apiEntityBaseUrl.concat("get"), app: app
        }
    }
}

export const resetPurchaseTransaction = () => ({
    type: types.RESET_TRX_PURCHASE,
    payload: {},
    meta: { type: types.RESET_TRX_PURCHASE }
})
export const submitPurchaseTransaction = (request, app) => {
    app.startLoading(true);
    console.log("Submit Supply Purchase...")
    let requested = {
        type: types.SUBMIT_TRX_PURCHASE,
        payload: {
            customer: request.customer,
            productFlows: request.productFlows
        },
        meta: {
            app: app, type: types.SUBMIT_TRX_PURCHASE, url: apiTransaction.concat("purchase")
        }
    };
    return requested;
}
export const submitSupplyTrx = (request, app) => {
    console.log("Submit Supply Trx...")
    app.startLoading(true);
    let requested = {
        type: types.SUBMIT_TRX_SUPPLY,
        payload: {
            supplier: request.supplier,
            productFlows: request.productFlows
        },
        meta: {
            app: app, type: types.SUBMIT_TRX_SUPPLY, url: apiTransaction.concat("supply")
        }
    };
    return requested;
}

export const getStockInfo = (stockId, app) => {
    app.startLoading();
    return {
        type: types.GET_STOCK_INFO,
        payload: { productFlow: { id: stockId } },
        meta: {
            app: app, type: types.GET_STOCK_INFO, url: apiTransaction.concat("stockinfo")
        }
    }
}

export const performLogout = (app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGOUT,
        payload: {},
        meta: { app: app, type: types.DO_LOGOUT, url: apiAccount.concat("logout") }
    };
    return loginRequest;
}

export const performLogin = (username, password, app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGIN,
        payload: {
            user: { username: username, password: password }
        },
        meta: { type: types.DO_LOGIN, url: apiAccount.concat("login"), app: app }
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

export const getSupplierList = (request, app) => {
    app.startLoading();
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
            url: apiBaseUrl.concat("get"),
            app: app
        }
    };

    if (request.categoryId != null) {
        requested.payload.filter.fieldsFilter["category,id[EXACTS]"] = request.categoryId;
    }

    return requested;
}

export const getProductList = (request, app) => {
    app.startLoading(true);
    let requested = {
        type: types.FETCH_PRODUCT_LIST,
        payload: {
            entity: "product",
            filter: {
                limit: 10,
                page: request.page,
                fieldsFilter: {
                    name: request.name,
                    withStock: request.withStock
                },
                orderBy: request.orderby,
                orderType: request.ordertype
            }
        },
        meta: {
            type: types.FETCH_PRODUCT_LIST,
            url: apiBaseUrl.concat("get"),
            app: app
        }
    };

    if (request.categoryId != null) {
        requested.payload.filter.fieldsFilter["category,id[EXACTS]"] = request.categoryId;
    }

    return requested;
}


export const getProductDetail = (code, app) => {
    app.startLoading(true);
    return {
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
            url: apiBaseUrl.concat("get"),
            app: app
        }
    }
}

export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})

export const loadMoreSupplier = (page, productId, referrer) => {
    referrer.props.app.startLoading();
    return {
        type: types.LOAD_MORE_SUPPLIER,
        payload: { filter: { page: page, fieldsFilter: { "productId": productId } } },
        meta: {
            type: types.LOAD_MORE_SUPPLIER,
            url: apiBaseUrl.concat("moresupplier"),
            referrer: referrer
        }
    }
}

