import {StatusBar} from 'expo-status-bar';
import RootNavigator from "./src/navigation";
import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from "aws-amplify-react-native";
import awsconfig from './src/aws-exports';
import AuthContextProvider from "./src/contexts/AuthContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import {IconComponentProvider} from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { I18nManager } from "react-native";
import ElapsedTimeContextProvider from "../UberEatsUser/src/contexts/ElapsedTimeContext";
import {AWSIoTProvider} from "@aws-amplify/pubsub";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

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

        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <NavigationContainer>
                <AuthContextProvider>
                    <RestaurantContextProvider>
                        <BasketContextProvider>
                            <OrderContextProvider>
                                <CourierContextProvider>
                                    <ElapsedTimeContextProvider>
                                    <RootNavigator/>
                                    </ElapsedTimeContextProvider>
                                </CourierContextProvider>
                            </OrderContextProvider>
                        </BasketContextProvider>
                    </RestaurantContextProvider>
                </AuthContextProvider>
                <StatusBar style="light"/>
            </NavigationContainer>
        </IconComponentProvider>
    )
}

export default withAuthenticator(App)


