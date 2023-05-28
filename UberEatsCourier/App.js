import * as WebBrowser from "expo-web-browser";
import {I18nManager} from "react-native";
import {StatusBar} from "expo-status-bar";
import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import RNRestart from 'react-native-restart';
import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';
import DirectionContextProvider from "./src/contexts/DirectionContext";
import CourierContext from "./src/contexts/CourierContext";
import * as AuthSession from "expo-auth-session";
import {NewProtectedRoutes} from "./src/navigation/NewProtectedRoutes";

// Amplify.Logger.LOG_LEVEL = 'DEBUG';
if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    RNRestart.Restart();
}

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
                            <NewProtectedRoutes/>
                        </DirectionContextProvider>
                    </OrderContextProvider>
                </CourierContext>
            </AuthContextProvider>
            <StatusBar style="auto"/>
        </NavigationContainer>
    )
}
