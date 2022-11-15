import {StatusBar} from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from "./src/navigation";
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from "aws-amplify-react-native";
Amplify.configure(awsconfig);

 function App() {
    return (
<NavigationContainer>
            <RootNavigator/>
            <StatusBar style="light"/>
</NavigationContainer>
    );
}
export default withAuthenticator(App);


