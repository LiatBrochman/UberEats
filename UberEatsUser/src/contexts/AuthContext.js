import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import {Customer} from "../models";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import Constants from "expo-constants";
import {ANDROID_CLIENT_ID, EXPO_CLIENT_ID,IOS_CLIENT_ID} from "@env";
// import jwtDecode from "jwt-decode";
// import * as AuthSession from "expo-auth-session";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const isExpo = Constants.executionEnvironment === 'storeClient';
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    WebBrowser.maybeCompleteAuthSession();
    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const sub = authUser?.attributes?.sub;
    // const [isAuthenticating, setIsAuthenticating] = useState(false)
    // let request, response;
    // const [request, response, googleSignin] = Google.useAuthRequest(
    //     {
    //         androidClientId: ANDROID_CLIENT_ID,
    //         iosClientId:IOS_CLIENT_ID
    //         // expoClientId: EXPO_CLIENT_ID,
    //     })
    const googleSignin = useCallback(() => {
        try {
            Auth.federatedSignIn({provider: "Google"})
        } catch (e) {
            console.error('Error during federated sign-in:', e)
        }
    }, [])
    const cognitoSignIn = useCallback(() => {
        try {
            Auth.federatedSignIn()

        } catch (e) {
            console.error('Error during federated sign-in:', e)
        }
    }, [])
    const signOut = useCallback(() => {
        try {
            Auth.signOut({global: true})
        } catch (e) {
            console.error('Error during federated sign-out:', e)
        }
    }, [])
    const performCleanup = useCallback(nextAppState => {
        if (nextAppState === 'inactive') {//todo :?? || nextAppState === 'background'
            // Iterate through the subscription object values
            for (const key in subscription) {
                // Check if the current object value has an "unsubscribe" method
                if (typeof subscription[key].unsubscribe === 'function') {
                    // Call the "unsubscribe" method
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ unsubscribing from ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription[key], null, 4))
                    subscription[key].unsubscribe()
                }
            }
        }
    }, [subscription])

    useEffect(() => {

        subscription.hubListener = Hub.listen("auth", ({payload: {event}}) => {
            switch (event) {

                case "signIn":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ ")
                    Auth.currentAuthenticatedUser()
                        .then(setAuthUser)
                        .catch(() => console.log("Not signed in"))
                    break;

                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ ")
                    if (authUser) {
                        setAuthUser(null)
                        DataStore.clear().then(async () => await DataStore.start()).catch((e) => console.error("couldn't clear the datastore", e))
                    }
                    break;
            }
        })


        Auth.currentAuthenticatedUser()
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => console.log("Not signed in"))

        const unsubscribe_from_all = AppState.addEventListener('change', performCleanup)

        // return () => {
        //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ unsubscribe_from_all ~~~~~~~~~~~~~~~~~~~~~ ")
        // unsubscribe_from_all()
        // }
        // return subscription.hubListener
    }, [])

    // useEffect(() => {
    //     if (isAuthenticating) return;
    //
    //     if (response?.type === "success") {
    //         setIsAuthenticating(true)
    //
    //         try {
    //             const {id_token} = response.params
    //             const decodedToken = jwtDecode(id_token)
    //             let user = {
    //                 name: "google_" + decodedToken.sub,
    //                 email: decodedToken.email
    //             }
    //
    //             Auth.federatedSignIn(
    //                 {provider: 'Google'},
    //                 {token: id_token, expires_at: 3600 * 1000 + new Date().getTime()},
    //                 user
    //             )
    //                 .catch(error => console.error("Error signing in:", error))
    //
    //         } catch (error) {
    //             console.log('Error signing in:', error)
    //
    //         } finally {
    //             setIsAuthenticating(false)
    //         }
    //     }
    // }, [response])

    useEffect(() => {
        if (!sub) return;
        /**
         * set Customer
         */
        subscription.customer = DataStore.observeQuery(Customer, c => c.sub.eq(sub))
            .subscribe(({items, isSynced}) => {
                isSynced && setDbCustomer(items[0])
            })
    }, [sub])


    return (
        <AuthContext.Provider value=
                                  {{
                                      authUser,
                                      dbCustomer,
                                      sub,
                                      setDbCustomer,
                                      googleSignin,
                                      cognitoSignIn,
                                      signOut,
                                      // request,
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
