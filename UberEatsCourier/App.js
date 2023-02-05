import {StatusBar} from "expo-status-bar";
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native'
import awsconfig from './src/aws-exports';
import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';
import ElapsedTimeContextProvider from "./src/contexts/ElapsedTimeContext";


Amplify.configure({...awsconfig, Analytics: {disabled: true}})
global.subscription = {}

function App() {
    return (
        <NavigationContainer>
            <AuthContextProvider>
                <OrderContextProvider>
                    <ElapsedTimeContextProvider>
                        <Navigation/>
                    </ElapsedTimeContextProvider>
                </OrderContextProvider>
            </AuthContextProvider>
            <StatusBar style="auto"/>
        </NavigationContainer>
    )
}

export default withAuthenticator(App)
