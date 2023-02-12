import {StatusBar} from 'expo-status-bar';
import RootNavigator from "./src/navigation";
import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import {withOAuth} from "aws-amplify-react-native";
import awsconfig from './src/aws-exports';
import AuthContextProvider from "./src/contexts/AuthContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import {Button, IconComponentProvider, Text} from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {I18nManager, Platform, View} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from 'expo-linking';


I18nManager.forceRTL(false);
I18nManager.allowRTL(false);


async function urlOpener(url, redirectUrl) {
    const {type, url: newUrl} = await WebBrowser.openAuthSessionAsync(
        url,
        redirectUrl
    );

    if (type === "success" && Platform.OS === "ios") {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
}


Amplify.configure({
    ...awsconfig, oauth: {
        ...awsconfig.oauth,
        redirectSignIn: "exp://127.0.0.1:19000",
        redirectSignOut: "exp://127.0.0.1:19000",
        urlOpener
    }, Analytics: {disabled: true}
})
global.subscription = {}

function App(props) {

    const {
        oAuthUser,
        oAuthError,
        hostedUISignIn,
        facebookSignIn,
        googleSignIn,
        amazonSignIn,
        customProviderSignIn,
        signOut,
    } = props;


    if (oAuthUser) {
        return (
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <NavigationContainer>
                    <AuthContextProvider>
                        <RestaurantContextProvider>
                            <BasketContextProvider>
                                <OrderContextProvider>
                                    <CourierContextProvider>
                                        <RootNavigator/>
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


    return (
        <View>

                <Text>User: {oAuthUser ? JSON.stringify(oAuthUser.attributes) : 'None'}</Text>
                {/* Go to the Cognito Hosted UI */}
                <Button title="Cognito" onPress={hostedUISignIn}/>

                {/* Go directly to a configured identity provider */}
                <Button title="Facebook" onPress={facebookSignIn}/>
                <Button title="Google" onPress={googleSignIn}/>
                <Button title="Amazon" onPress={amazonSignIn}/>

                {/* e.g. for OIDC providers */}
                <Button title="Yahoo" onPress={() => customProviderSignIn('Yahoo')}/>

        </View>)

}

export default withOAuth(App)


// function App() {
//
//     return (
//         <IconComponentProvider IconComponent={MaterialCommunityIcons}>
//             <NavigationContainer>
//                 <AuthContextProvider>
//                     <RestaurantContextProvider>
//                         <BasketContextProvider>
//                             <OrderContextProvider>
//                                 <CourierContextProvider>
//                                     <RootNavigator/>
//                                 </CourierContextProvider>
//                             </OrderContextProvider>
//                         </BasketContextProvider>
//                     </RestaurantContextProvider>
//                 </AuthContextProvider>
//                 <StatusBar style="light"/>
//             </NavigationContainer>
//         </IconComponentProvider>
//     )
// }
// export default withAuthenticator(App)



