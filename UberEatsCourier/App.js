import * as Linking from 'expo-linking';
import * as WebBrowser from "expo-web-browser";
import {I18nManager, Platform} from "react-native";
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
import { makeRedirectUri } from 'expo-auth-session';


// const { manifest } = Constants;
// console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ manifest ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(manifest.debuggerHost,null,4))
// const { manifest:{debuggerHost} } = Constants;
// console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ debuggerHost ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(debuggerHost,null,4))
// const [, hostAndPort] = Constants.manifest.debuggerHost.split(':');
// const [port] = hostAndPort.split(',');
// const [port] = Constants.manifest.debuggerHost.split(':')[1].split(',') in one line!
// console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ port ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(port,null,4))


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

// Set different redirect URLs for development and production environments
const redirectUri = makeRedirectUri({
    native: Constants.manifest.scheme + '://auth/',
    useProxy: true,
});
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ redirectUri ~~~~~~~~~~~~~~~~~~~~~ :",redirectUri)
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
