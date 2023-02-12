import {Authenticator, SignIn} from 'aws-amplify-react-native';
import React, {useCallback, useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {Button, I18nManager, Platform, StyleSheet, Text, View} from "react-native";
import * as Linking from 'expo-linking';
import * as WebBrowser from "expo-web-browser";
import {Amplify, Auth, Hub} from "aws-amplify";
import awsconfig from "./src/aws-exports";
import {IconComponentProvider} from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {NavigationContainer} from "@react-navigation/native";
import AuthContextProvider from "./src/contexts/AuthContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import CourierContextProvider from "./src/contexts/CourierContext";
import RootNavigator from "./src/navigation";
import {CognitoHostedUIIdentityProvider} from "@aws-amplify/auth";
import * as Device from 'expo-device';
global.subscription = {};
let isPhone = Device.isDevice;
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
const updatedConfig = {
    ...awsconfig,
    oauth: {
        ...awsconfig.oauth,
        redirectSignIn: isPhone
            ? "exp://192.168.1.235:19000"
            : "exp://127.0.0.1:19000",
        redirectSignOut: isPhone
            ? "exp://192.168.1.235:19000"
            : "exp://127.0.0.1:19000",
        urlOpener,
    },
};
Amplify.configure(updatedConfig);


export default function App() {

    const [user, setUser] = useState(null)
    const [customState, setCustomState] = useState(null)
    const googleSignin = useCallback(() => {
        Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google}).then(setUser)
    }, []);
    // const cognitoSignin = useCallback(() => {
    //     Auth.federatedSignIn().then(setUser)
    // }, []);
    useEffect(() => {

        const unsubscribe = Hub.listen("auth", ({payload: {event, data}}) => {
            // console.log("event", event);
            // console.log("data", data);
            switch (event) {
                case "signIn":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ :")
                    setUser(data);
                    break;
                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ :")
                    setUser(null);
                    break;
                case "customOAuthState":
                    setCustomState(data);
                    break;
                case "configured":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ configured ~~~~~~~~~~~~~~~~~~~~~ :")

                    data && setUser(data);
                    data && console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ configured data ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(data?.getUsername(), null, 4))

                    break;
                default:
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ default ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(event, null, 4))

            }
        });

        Auth.currentAuthenticatedUser()
            .then((currentUser) => setUser(currentUser))
            .catch(() => console.log("Not signed in"));

        return unsubscribe;
    }, []);

    if (user) {
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


//     function SignOutButton() {
//         const { signOut } = useAuthenticator();
//         return <Button title="Sign Out" onPress={signOut} />;
//     }
// return (
//     <View>
//         <Authenticator.Provider>
//             <Authenticator
//                 components={{
//                     SignIn: (props) => (
//                         <Authenticator.SignIn {...props} hideSignUp />
//                     ),
//                 }}
//             >
//                 <SignOutButton />
//             </Authenticator>
//         </Authenticator.Provider>
//                 <Button
//                     title="Sign in With Google"
//                     onPress={() =>
//                         Auth.federatedSignIn({
//                             provider: CognitoHostedUIIdentityProvider.Google,
//                         })
//                     }
//                 />
//     </View>
// )

    return (

        <View style={styles.container}>

            <Authenticator hideDefault={true}>
                <SignIn/>
                <View style={styles.container}>
                    <Text>Hello, {user?.name ?? "please login."}</Text>
                    {!user && <Button title="Login with Google" onPress={googleSignin}/>}
                    {/*{!user && <Button title="Login with Cognito" onPress={cognitoSignin}/>}*/}

                </View>
            </Authenticator>

        </View>
    )


    // return (
    //     <View style={styles.container}>
    //         <Button title="Open Hosted UI" onPress={() => Auth.federatedSignIn()}/>
    //         <Button
    //             title="Open Facebook"
    //             onPress={() =>
    //                 Auth.federatedSignIn({
    //                     provider: CognitoHostedUIIdentityProvider.Facebook,
    //                 })
    //             }
    //         />
    //         <Button
    //             title="Open Google"
    //             onPress={() =>
    //                 Auth.federatedSignIn({
    //                     provider: CognitoHostedUIIdentityProvider.Google,
    //                 })
    //             }
    //         />
    //         <Button
    //             title="Open Amazon"
    //             onPress={() =>
    //                 Auth.federatedSignIn({
    //                     provider: CognitoHostedUIIdentityProvider.Amazon,
    //                 })
    //             }
    //         />
    //         <Button
    //             title="Open Apple"
    //             onPress={() =>
    //                 Auth.federatedSignIn({
    //                     provider: CognitoHostedUIIdentityProvider.Apple,
    //                 })
    //             }
    //         />
    //         <Button title="Sign Out" onPress={() => Auth.signOut()}/>
    //         <Text>{user && user.getUsername()}</Text>
    //         <>
    //             {/*{*/}
    //             {/*    user && console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ user.getUsername() ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(user.getUsername(), null, 4))*/}
    //             {/*}*/}
    //         </>
    //         <Button onPress={async () => await DataStore.clear().then(async () => await DataStore.start())
    //         } title="Amplify.DataStore.clear()"/>
    //         <StatusBar style="auto"/>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});