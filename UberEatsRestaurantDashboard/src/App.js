import {Layout} from "antd";
import AppMenu from '../src/components/AppMenu';
import {withAuthenticator} from '@aws-amplify/ui-react';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import './App.css'
import '@aws-amplify/ui-react/styles.css';
import Background from "./assets/bg5.jpg";
import { Route, Routes } from 'react-router-dom';
import DeleteAccountPage from './screens/DeleteAccountPage';

const {Content} = Layout;

function App() {
    return (
        <div style={{backgroundImage:`url(${Background})`, backgroundSize: "100% 100%"}}>
            <AppMenu/>
            <Content>
                <Routes>
                    <Route path="/delete-account" element={<DeleteAccountPage />} />
                    <Route path="/*" element={<ProtectedRoutes />} />
                </Routes>
            </Content>
        </div>
    )
}

export default withAuthenticator(App);
