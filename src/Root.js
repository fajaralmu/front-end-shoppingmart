import React from 'react'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore'
import { BrowserRouter } from 'react-router-dom';

const Root = (props) => {

    const store = configureStore();

    return (
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>

    );
}


export default Root;