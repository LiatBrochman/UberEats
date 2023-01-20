import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.min.css';
import {Amplify} from "aws-amplify";
import config from './aws-exports';


Amplify.configure({...config, Analytics: {disabled:true,}})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>

);
