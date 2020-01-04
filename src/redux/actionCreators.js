import * as types from './types'
const apiBaseUrl = "http://localhost:8080/universal-good-shop/api/public/"
const apiEntityBaseUrl = "http://localhost:8080/universal-good-shop/api/entity/"


export const getAllProductCategories = () => ({
    type: types.FETCH_PRODUCT_CATEGORIES_ALL,
    payload: {
        "entity": "category",
        "filter": {
            "limit": 0,
            "page": 0,
            "orderBy": null,
            "orderType": null,
            "fieldsFilter": {}
        }
    },
    meta: {
        type: types.FETCH_PRODUCT_CATEGORIES_ALL,
        url: apiEntityBaseUrl.concat("get")
    }
})

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

    if(request.categoryId != null){
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
    meta: {
        type: types.REMOVE_SHOP_ENTITY
    }
})

export const loadMoreSupplier = (page, productId) => ({
    type: types.LOAD_MORE_SUPPLIER,
    payload: { "filter": { "page": page, "fieldsFilter": { "productId": productId } } },
    meta: {
        type: types.LOAD_MORE_SUPPLIER,
        url: apiBaseUrl.concat("moresupplier")
    }
})

// export const deleteExam = (id) => ({
//     type: types.DELETE_EXAM,
//     payload: [],
//     meta: {
//         type: 'delete_exam',
//         url: apiURL + "remove/" + id,
//         id: id
//     }
// })

// export const getExamById = (id) => ({
//     type: types.FETCH_EXAM_BY_ID,
//     payload: [],
//     meta: {
//         type: 'get_exam_by_id',
//         url: apiURL + "get/" + id,
//         id: id
//     }
// })

// export const submitExam = (exam) => ({
//     type: types.SUBMIT_EXAM,
//     payload: [],
//     meta: {
//         type: 'submit_exam',
//         url: apiURL + "submitexam",
//         exam: exam
//     }
// })

// export const appNewExam = (exam) => ({
//     type: types.ADD_EXAM,
//     payload: [],
//     meta: {
//         type: 'add_exam',
//         url: apiURL + "add",
//         exam: exam
//     }
// })

// export const updateExam = (exam) => ({
//     type: types.UPDATE_EXAM,
//     payload: [],
//     meta: {
//         type: 'update_exam',
//         url: apiURL + "updateexam",
//         exam: exam
//     }
// })

// export const fetchOneExam = () => ({
//     type: types.FETCH_ONE_EXAM,
//     payload: [{
//         id: 1,
//         title: "ff",
//         user: {
//             name: "suser",
//             role: "d.role",
//         },
//         date: "2019-11-12",
//         body: "body body body body"
//     },
//     ]
// })

// export const login = () => ({
//     type: types.LOG_IN,
//     payload: {
//         name: "el-fajr",
//         status: "logged in"
//     }
// })

// export const logout = () => ({
//     type: types.LOG_OUT,
//     payload: {
//         name: "el-fajr",
//         status: "logged out"
//     }
// })