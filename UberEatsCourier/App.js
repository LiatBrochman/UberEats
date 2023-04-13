import * as WebBrowser from "expo-web-browser";
import {I18nManager} from "react-native";
import {StatusBar} from "expo-status-bar";
import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import Constants from 'expo-constants';
import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';
import ProtectedRoutes from "./src/navigation/ProtectedRoutes";
import DirectionContextProvider from "./src/contexts/DirectionContext";
import CourierContext from "./src/contexts/CourierContext";
import * as AuthSession from "expo-auth-session";


// Amplify.Logger.LOG_LEVEL = 'DEBUG';
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const updatedConfig = {
    ...awsconfig, oauth: {
        ...awsconfig.oauth,
        redirectSignIn: AuthSession.makeRedirectUri({path: 'signInRedirect'}),
        redirectSignOut: AuthSession.makeRedirectUri({path: 'signOutRedirect'})
    },
    Analytics: {
        disabled: true,
    },
};
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ redirect ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updatedConfig.oauth.redirectSignIn, null, 4))


Amplify.configure(updatedConfig);

global.subscription = {};
WebBrowser.maybeCompleteAuthSession();

export default function App() {

    return (
        <NavigationContainer>
            <AuthContextProvider>
                <CourierContext>
                    <OrderContextProvider>
                        <DirectionContextProvider>
                            <ProtectedRoutes/>
                        </DirectionContextProvider>
                    </OrderContextProvider>
                </CourierContext>
            </AuthContextProvider>
            <StatusBar style="auto"/>
        </NavigationContainer>
    )
}
