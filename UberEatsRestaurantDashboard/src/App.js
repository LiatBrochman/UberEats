import {Layout} from "antd";
import AppMenu from '../src/components/AppMenu';
import {withAuthenticator} from '@aws-amplify/ui-react';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import './App.css'
import '@aws-amplify/ui-react/styles.css';
import Background from "./assets/bg5.jpg";

const {Content} = Layout;

function App() {

    return (
        <div style={{backgroundImage:`url(${Background})`, backgroundSize: "cover"}}>
            <AppMenu/>
            <Content>
                <ProtectedRoutes/>
            </Content>
        </div>

    )
}
export default withAuthenticator(App)
