import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as actionCreator from './actionCreators';
import * as types  from './types';

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(
           getProductListMiddleware,
           getProductDetailMiddleWare,
           removeEntityMiddleware,
           loadMoreSupplierMiddleware
        )
    );

    return store;
}

const loadMoreSupplierMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.LOAD_MORE_SUPPLIER) {
        return next(action);
    } 
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {
            'Content-Type': 'application/json',
            'requestId':'1234'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:",data);
            if(data.entities == null ||data.entities.length == 0){
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data 
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
    
}

const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) {
        return next(action);
    } 
    let newAction = Object.assign({}, action, {
        payload: null
    });
    delete newAction.meta;
    store.dispatch(newAction);
    
}

const getProductDetailMiddleWare = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_DETAIL) {
        return next(action);
    } 

    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {
            'Content-Type': 'application/json',
            'requestId':'1234'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:",data);
            if(data.entities == null ||data.entities.length == 0){
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const getProductListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.FETCH_PRODUCT_LIST) {
        return next(action);
    } 

    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {
            'Content-Type': 'application/json',
            'requestId':'1234'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.debug("Response:",data);
            if(data.entities == null ||data.entities.length == 0){
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const addUserMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'add_user') {
        return next(action);
    }
    if (!window.confirm("continue registration?"))
        return false;
    let user = action.meta.user;
   
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            let regstatus = false;
            if(data == 1){
                alert("registration successfull");
                regstatus = true;
            }else{
                alert("registration unsuccessfull");
            }
            let newAction = Object.assign({}, action, {
                payload: regstatus
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const loggigMiddleware = store => next => action => {
    console.log(`Redux Log `, action);
    next(action);
}

const addExamMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'add_exam') {
        return next(action);
    }
    if (!window.confirm("LANJUT?"))
        return false;
    let exam = action.meta.exam;
    console.log("exam to be added ", exam);
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(exam),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(res => {
            if (res == 1) {
                alert("tambah sukses");
               // store.dispatch(fetchAllExam());
            }
        })
        .catch(err => console.log(err));
}

const udpateExamMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'update_exam') {
        return next(action);
    }
    if (!window.confirm("LANJUT?"))
        return false;
    let exam = action.meta.exam;
    console.log("exam to be update ", exam);
    fetch(action.meta.url, {
        method: 'PUT',
        body: JSON.stringify(exam),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()
    ).then(res => {
        if (res == 1) {
           // store.dispatch(fetchAllExam());
            alert("update sukses");
        }
    }).catch(err => console.log(err));
}

const deleteExamMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'delete_exam') {
        return next(action);
    }
    if (!window.confirm("DELETE?"))
        return false;
    fetch(action.meta.url, {
        method: 'DELETE'
    }).then(response => response.json()
    ).then(res => {
        if (res == 1) {
            //store.dispatch(fetchAllExam());
            alert("delete sukses");
        }
    }).catch(err => console.log(err));
}

const submitExamMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'submit_exam') {
        return next(action);
    }
    if (!window.confirm("LANJUT?"))
        return false;
    let exam = action.meta.exam;
    console.log("exam to be tested ", exam);
    fetch(action.meta.url, {
        method: 'POST',
        body: JSON.stringify(exam),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err));
}

const apiMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'api') {
        return next(action);
    }
    console.log("API Action, ", action);
    const { url } = action.meta
    const fetchOption = Object.assign({}, action.meta);

    fetch(url, fetchOption)
        .then(response => response.json())
        .then(data => {
            let exams = data;

            let newAction = Object.assign({}, action, {
                payload: exams
            });
            delete newAction.meta;
            store.dispatch(newAction);
        });
}

const getExamByIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== 'get_exam_by_id') {
        return next(action);
    }
    console.log("API Action, ", action);
    const { url } = action.meta

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        response => response.json()
    ).then(
        data => {
            let exam = data
            let newAction = Object.assign({}, action, {
                payload: exam
            });
            delete newAction.meta;
            store.dispatch(newAction);
        }
    ).catch(err => { alert(err); console.log(err); });
}


export default configureStore;