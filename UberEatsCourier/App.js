import {StatusBar} from "expo-status-bar";
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native'
import awsconfig from './src/aws-exports';
import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';
import ElapsedTimeContextProvider from "./src/contexts/ElapsedTimeContext";
import {AWSIoTProvider} from "@aws-amplify/pubsub";

Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: 'us-east-1',
        aws_pubsub_endpoint: 'wss://a7qe1o6h9jfvb-ats.iot.us-east-1.amazonaws.com/mqtt'
    })
)
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
