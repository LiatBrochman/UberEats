import {Layout} from "antd";
import AppMenu from '../src/components/AppMenu';
import {withAuthenticator} from '@aws-amplify/ui-react';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import './App.css'

const {Content} = Layout;


function App() {

    return (
        <div>
            <AppMenu/>
            <Content>
                <ProtectedRoutes/>
            </Content>
        </div>

    )
}
export default withAuthenticator(App)
