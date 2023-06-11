import {Route, Routes, useNavigate} from 'react-router-dom';
import {withAuthenticator} from '@aws-amplify/ui-react';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AppMenu from '../src/components/AppMenu';
import DeleteAccountPage from './screens/DeleteAccountPage';
import {useEffect} from "react";
import {Layout} from "antd";
import Background from "./assets/bg5.jpg";
import '@aws-amplify/ui-react/styles.css';
import './App.css'


function App() {
    const navigate = useNavigate()

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ localStorage.getItem('postAuthPath') ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(localStorage.getItem("postAuthPath"), null, 4))

        if (localStorage.getItem("postAuthPath") === "/delete-account") {
            navigate("/delete-account")
            // localStorage.removeItem("postAuthPath")
        }
    }, [])

    return (
        <div style={{backgroundImage: `url(${Background})`, backgroundSize: "100% 100%"}}>
            <AppMenu/>
            <Layout.Content>
                <Routes>
                    <Route path="/delete-account" element={<DeleteAccountPage/>}/>
                    <Route path="/*" element={<ProtectedRoutes/>}/>
                </Routes>
            </Layout.Content>
        </div>
    )
}

export default withAuthenticator(App)
