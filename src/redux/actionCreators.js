import * as types from './types'
const apiBaseUrl = "http://localhost:8080/universal-good-shop/api/public/"



export const getProductList = (requestPage) => ({
    type: types.FETCH_PRODUCT_LIST,
    payload: {
        entity: "product",
       filter: {
            limit: "10",
            page: requestPage, 
            fieldsFilter: {
                name: "",
                withStock: false
            }
        }
    },
    meta: {
        type: types.FETCH_PRODUCT_LIST,
        url: apiBaseUrl.concat("get")
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