import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.min.css';
import AuthContextProvider from "./contexts/AuthContext";
import OrderContextProvider from "./contexts/OrderContext";
import RestaurantContextProvider from "./contexts/RestaurantContext";
import {Amplify} from "aws-amplify";
import awsconfig from './aws-exports';

window.subscription = {};
awsconfig.oauth.redirectSignIn = window.location.origin
awsconfig.oauth.redirectSignOut = window.location.origin

Amplify.configure({...awsconfig, Analytics: {disabled: true}});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <AuthContextProvider>
            <RestaurantContextProvider>
                <OrderContextProvider>
                    <App/>
                </OrderContextProvider>
            </RestaurantContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
)

