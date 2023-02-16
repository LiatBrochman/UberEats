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
import AuthContextProvider from "./src/contexts/AuthContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import ProtectedRoutes from "./src/navigation/ProtectedRoutes";
import Constants from 'expo-constants';

global.subscription = {};
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

async function urlOpener(url, redirectUrl) {
    const {type, url: newUrl} = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    if (type === "success" && Platform.OS === "ios") {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
}

const host = 'exp://' + Constants.manifest.debuggerHost;
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ host ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(host, null, 4));
const updatedConfig = {
    ...awsconfig,
    oauth: {
        ...awsconfig.oauth,
        redirectSignIn: host,
        redirectSignOut: host,
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
