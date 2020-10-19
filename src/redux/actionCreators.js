import * as types from './types'
import * as url from '../constant/Url'

const usedHost = url.contextPath();
const apiBaseUrl = usedHost + "api/public/"
const apiEntityBaseUrl = usedHost + "api/entity/"
const apiAccount = usedHost + "api/account/"
const apiAdmin = usedHost + "api/admin/"
const apiTransaction = usedHost + "api/transaction/";

export const resetProductStocks = () => {
    return { type: types.RESET_PRODUCT_STOCKS, payload: {}, meta: { type: types.RESET_PRODUCT_STOCKS } };
}

export const updateCart = (cart, app) => {
    return { type: types.UPDATE_CART, payload: { cart: cart, app: app }, meta: { type: types.UPDATE_CART } };
}

export const resetProducts = () => {
    return { type: types.RESET_PRODUCTS, payload: {}, meta: { type: types.RESET_PRODUCTS } };
} 

export const removeManagedEntity = () => {
    return {
        type: types.REMOVE_MANAGED_ENTITY,
        payload: {},
        meta: { type: types.REMOVE_MANAGED_ENTITY }
    };
}

export const updateEntity = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.UPDATE_ENTITY,
        payload: {
            "entity": request.entityName
        },
        meta: {
            type: types.UPDATE_ENTITY,
            url: request.isNewRecord ? apiEntityBaseUrl.concat("add") : apiEntityBaseUrl.concat("update"),
            app: referer.props.app,
            callback: callback,
            referer: referer
        }
    };
    requested.payload[request.entityName] = request.entity;
    return requested;
}

export const getEntitiesWithCallback = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.GET_ENTITY_WITH_CALLBACK,
        payload: {
            "entity": request.entityName,
            "filter": {
                "limit": 10,
                'fieldsFilter': {}
            }
        },
        meta: {
            type: types.GET_ENTITY_WITH_CALLBACK,
            url: apiEntityBaseUrl.concat("get"),
            app: referer.props.app,
            referer: referer,
            callback: callback
        }
    };
    requested.payload.filter.fieldsFilter[request.fieldName] = request.fieldValue;
    return requested;
}

export const getEntityById = (name, id, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_BY_ID,
        payload: {
            "entity": name,
            "filter": {
                "limit": 1,
                "page": 0,
                "exacts": true,
                "contains": false,
                "fieldsFilter": { "id": id }
            }
        },
        meta: {
            type: types.GET_ENTITY_BY_ID,
            url: apiEntityBaseUrl.concat("get"),
            app: app
        }
    };
    return requested;
}

export const getEntityList = (request, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY,
        payload: {
            entity: request.entityName,
            filter: {
                limit: request.limit,
                page: request.page,
                fieldsFilter: request.fieldsFilter,
                orderBy: request.orderBy,
                orderType: request.orderType,
            },

        },
        meta: {
            type: types.GET_ENTITY,
            url: apiEntityBaseUrl.concat("get"),
            app: app,
            entityConfig: request.entityConfig
        }
    };
    return requested;
}


export const getEntityProperty = (entityName, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_PROPERTY,
        payload: {
            entity: entityName
        },
        meta: {
            type: types.GET_ENTITY_PROPERTY,
            url: apiEntityBaseUrl.concat("config"),
            app: app,
        }
    };
    return requested;
}


export const getManagementMenus = (app) => {
    app.startLoading();
    let requested = {
        type: types.GET_MANAGEMENT_MENUS,
        payload: {},
        meta: {
            type: types.GET_MANAGEMENT_MENUS,
            url: apiEntityBaseUrl.concat("managementpages"),
            app: app,
        }
    };
    return requested;
}

export const getProductStocks = (name, app) => {
    app.startLoading(true);
    return {
        type: types.GET_PRODUCT_STOCKS,
        payload: {
            entity: 'product',
            filter: {
                limit: 20,
                fieldsFilter: { name: name }
            }
        },
        meta: {
            app: app, type: types.GET_PRODUCT_STOCKS,
            url: apiEntityBaseUrl.concat("get")
        }
    };
}

export const requestAppId = (app) => {
    app.startLoading();
    return {
        type: types.REQUEST_ID,
        payload: {},
        meta: {
            app: app, type: types.REQUEST_ID,
            url: apiBaseUrl.concat("requestid")
        }
    };
}

export const getMessageList = (app) => {
    app.startLoading();
    return {
        type: types.GET_MESSAGE,
        payload: {},
        meta: {
            type: types.GET_MESSAGE, app: app,
            url: apiAdmin.concat("getmessages")
        }
    };
}

export const storeMessageLocally = (messages) => {

    return {
        type: types.STORE_MESSAGE,
        payload: {
            entities: messages
        },
        meta: {
            type: types.STORE_MESSAGE,
        }
    };
}

export const sendChatMessage = (message, username, app) => {
    app.startLoading();
    return {
        type: types.SEND_MESSAGE,
        payload: {
            value: message,
            username: username
        },
        meta: {
            app: app,
            type: types.SEND_MESSAGE,
            url: apiAdmin.concat("sendmessage")
        }
    };
}

export const getProductSalesDetail = (request, app) => {
    app.startLoading(true);
    return {
        type: types.GET_PRODUCT_SALES_DETAIL,
        payload: {
            filter:
                { page: request.page, limit: 10, month: request.fromMonth, year: request.fromYear, monthTo: request.toMonth, yearTo: request.toYear }
        },
        meta: {
            app: app,
            type: types.GET_PRODUCT_SALES_DETAIL,
            loadMore: request.loadMore == true, url: apiTransaction.concat("productsalesdetail/" + request.productId)
        }
    };
}

export const getProductSales = (request) => {
    request.referrer.props.app.startLoading(true);
    return {
        type: types.GET_PRODUCT_SALES,
        payload: {
            product: { name: request.productName },
            filter:
                { page: request.page, limit: 10, month: request.fromMonth, year: request.fromYear, monthTo: request.toMonth, yearTo: request.toYear }
        },
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

export const getProductListTrx = (request, app) => {
    app.startLoading();
    const callback = request.callback;
    const fieldsFilter = {};
    fieldsFilter[request.filterName] = request.filterValue;

    return {
        type: types.FETCH_PRODUCT_LIST_TRX,
        payload: {
            entity: "product", filter: { page: 0, exacts: (request.exacts == true), limit: 10, fieldsFilter: fieldsFilter }
        },
        meta: {
            type: types.FETCH_PRODUCT_LIST_TRX, url: apiEntityBaseUrl.concat("get"), app: app, callback: callback
        }
    }
}
 

export const resetPurchasingAndSelling = () => ({
    type: types.RESET_TRX_SELLING_PURCHASING,
    payload: {},
    meta: { type: types.RESET_TRX_SELLING_PURCHASING }
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
            app: app, type: types.SUBMIT_TRX_PURCHASE, url: apiTransaction.concat("selling")
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
            app: app, type: types.SUBMIT_TRX_SUPPLY, url: apiTransaction.concat("purchasing")
        }
    };
    return requested;
}

export const getStockInfo = (productCode, app) => {
    app.startLoading();
    return {
        type: types.GET_STOCK_INFO,
        payload: {
            entity: "product",
            filter: {
                limit: 1,
                fieldsFilter:
                    { "code[EXACTS]": productCode, withStock: true }
            }
        },
        meta: {
            app: app, type: types.GET_STOCK_INFO, url: apiBaseUrl.concat("get")
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

export const getLoggedUser = (app) => {
    app.startLoading();
    let request = {
        type: types.GET_LOGGED_USER,
        payload: {},
        meta: { type: types.GET_LOGGED_USER, url: apiAccount.concat("user"), app: app }
    };
    return request;
}

export const refreshLoginStatus = () => {

    let loginRequest = {
        type: types.REFRESH_LOGIN,
        payload: {},
        meta: { type: types.REFRESH_LOGIN }
    };
    return loginRequest;
} 
  
export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})
 

