import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.min.css';
import AuthContextProvider from "./contexts/AuthContext";
import OrderContextProvider from "./contexts/OrderContext";
import RestaurantContextProvider from "./contexts/RestaurantContext";
import {Amplify} from "aws-amplify";
import awsconfig from './aws-exports';

console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ window.location.hash ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(window.location.hash,null,4))
window.location.hash === "#/delete-account" && localStorage.setItem('postAuthPath','/delete-account')
window.subscription = {};
const isLocalEnvironment = process.env.REACT_APP_ENV === 'local';
console.log("~~~~~~~~~~~~~~~~~~~~~ isLocalEnvironment ~~~~~~~~~~~~~~~~~~~~~ :", isLocalEnvironment)

awsconfig.oauth.redirectSignIn = isLocalEnvironment
    ? window.location.origin
    : 'https://timely-phoenix-06c7ef.netlify.app';

awsconfig.oauth.redirectSignOut = isLocalEnvironment
    ? window.location.origin
    : 'https://timely-phoenix-06c7ef.netlify.app';

Amplify.configure({...awsconfig, Analytics: {disabled: true}});

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <HashRouter>
            <AuthContextProvider>
                <RestaurantContextProvider>
                    <OrderContextProvider>
                        <App/>
                    </OrderContextProvider>
                </RestaurantContextProvider>
            </AuthContextProvider>
    </HashRouter>
)

