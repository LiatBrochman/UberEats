import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.min.css';
import AuthContextProvider from "./contexts/AuthContext";
import OrderContext from "./contexts/OrderContext";
import OrderContextProvider from "./contexts/OrderContext";




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthContextProvider>
            <OrderContextProvider>
                <App/>
            </OrderContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
)

