import {Layout} from "antd";
import AppMenu from '../src/components/AppMenu';
import {withAuthenticator} from '@aws-amplify/ui-react';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import './App.css'
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import {Amplify,Storage} from "aws-amplify";

Amplify.configure({...awsExports, Analytics: {disabled: true}});
Storage.configure({ region: awsExports.aws_project_region });

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
