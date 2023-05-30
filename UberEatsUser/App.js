import React from "react";
import {StatusBar} from "expo-status-bar";
import {Amplify} from "aws-amplify";
import awsconfig from "./src/aws-exports";
import {IconComponentProvider} from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {NavigationContainer} from "@react-navigation/native";
import AuthContextProvider from "./src/contexts/AuthContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import {I18nManager} from "react-native";
import RNRestart from 'react-native-restart';
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {NewProtectedRoutes} from "./src/navigation/NewProtectedRoutes";
import {runOnInit} from "./src/myExternalLibrary/runOnInit";


// Amplify.Logger.LOG_LEVEL = 'DEBUG';
if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    RNRestart.Restart();
}

// // Amplify.Logger.LOG_LEVEL = 'DEBUG';
// I18nManager.forceRTL(false);
// I18nManager.allowRTL(true);


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

Amplify.configure(updatedConfig);
global.subscription = {};
WebBrowser.maybeCompleteAuthSession();
runOnInit("user")

export default function App() {
    return (
        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <NavigationContainer>
                <AuthContextProvider>
                    <RestaurantContextProvider>
                        <BasketContextProvider>
                            <OrderContextProvider>
                                <CourierContextProvider>
                                    <NewProtectedRoutes/>
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
