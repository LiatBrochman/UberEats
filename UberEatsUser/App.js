import React from "react";
import {StatusBar} from "expo-status-bar";
import {I18nManager, Platform} from "react-native";
import * as Linking from 'expo-linking';
import * as WebBrowser from "expo-web-browser";
import {Amplify} from "aws-amplify";
import awsconfig from "./src/aws-exports";
import {IconComponentProvider} from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {NavigationContainer} from "@react-navigation/native";
import Constants from 'expo-constants';
import AuthContextProvider from "./src/contexts/AuthContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import ProtectedRoutes from "./src/navigation/ProtectedRoutes";
import { makeRedirectUri } from 'expo-auth-session';

global.subscription = {};
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

async function urlOpener(url, redirectUrl) {
    const {type, url: newUrl} = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    console.log('OAuth Response Type:', type);
    console.log('OAuth Response URL:', newUrl);
    if (type === "success" && Platform.OS === "ios") {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
}

// Set different redirect URLs for development and production environments
const redirectUri = makeRedirectUri({
    native: Constants.manifest.scheme + '://auth/', // ubereats://auth/
    useProxy: true,
});
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ redirectUri ~~~~~~~~~~~~~~~~~~~~~ :", redirectUri)

// // Check if the app is in development mode
// const isDev = process.env.NODE_ENV === 'development';
//
// // Set different redirect URLs for development and production environments
// const host = isDev
//     ? 'exp://' + Constants.manifest.debuggerHost
//     : Constants.manifest.scheme + '://auth/';

const updatedConfig = {
    ...awsconfig,
    Analytics: {
        disabled: true,
    },
    oauth: {
        ...awsconfig.oauth,
        redirectSignIn: redirectUri,
        redirectSignOut: redirectUri,
        urlOpener,
    },
};
Amplify.configure(updatedConfig);


export default function App() {
    return (
        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <NavigationContainer>
                <AuthContextProvider>
                    <RestaurantContextProvider>
                        <BasketContextProvider>
                            <OrderContextProvider>
                                <CourierContextProvider>
                                    <ProtectedRoutes/>
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
