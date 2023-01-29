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


awsconfig.oauth.redirectSignIn = window.location.origin
awsconfig.oauth.redirectSignOut = window.location.origin

// console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ awsconfig ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(awsconfig,null,4))

Amplify.configure(awsconfig);

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

