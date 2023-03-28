import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer} from "../models";
import * as Google from 'expo-auth-session/providers/google';
// import {Android_Client_ID, Expo_Client_ID} from '@env';

const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const sub = authUser?.attributes?.sub
    // const googleSignin = useCallback(() => {
    //     try {
    //         Auth.federatedSignIn({provider: 'Google'}).then(setAuthUser)
    //     } catch (e) {
    //         console.error('Error during federated sign-in:', e)
    //     }
    // }, [])
    // const cognitoSignIn = useCallback(() => {
    //     try {
    //         Auth.federatedSignIn().then(setAuthUser)
    //     } catch (e) {
    //         console.error('Error during federated sign-in:', e)
    //     }
    // }, [])
    // const signOut = useCallback(() => {
    //     try {
    //         Auth.signOut({global: true}).then(() => setAuthUser(null))
    //     } catch (e) {
    //         console.error('Error during federated sign-out:', e)
    //     }
    // }, [])
    // const handleDeepLink = async (event) => {
    //     // Process the incoming deep link
    //     console.log('Deep link:', event.url);
    //
    //     // Parse the URL to extract the authorization code
    //     const url = new URL(event.url);
    //     const authorizationCode = url.searchParams.get('code');
    //     const state = url.searchParams.get('state');
    //
    //     if (authorizationCode) {
    //         try {
    //             // Create a FederatedResponse object with the necessary data
    //             const response = {
    //                 code: authorizationCode,
    //                 state,
    //             };
    //
    //             // Use the FederatedResponse object to complete the federated sign-in
    //             const user = await Auth.federatedSignIn('google', response);
    //             setAuthUser(user);
    //         } catch (error) {
    //             console.error('Error during federated sign-in:', error);
    //         }
    //     }
    // };

    const [token, setToken] = useState("");
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     androidClientId: Android_Client_ID,
    //     expoClientId: Expo_Client_ID
    // });
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "316122509849-7jolq729aut144cvgcimpp7enphj6c8g.apps.googleusercontent.com",
        expoClientId: "316122509849-9st846m08u3ab08bftuji3ct7lvbbfq4.apps.googleusercontent.com"
    });
    const googleSignin = () => promptAsync({useProxy: true, showInRecents: true})

    useEffect(() => {
        if (response?.type === "success") {
            setToken(response.authentication.accessToken);
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ response ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(response,null,4))
        }
    }, [response]);


    // useEffect(() => {
    //
    //     // Add an event listener for incoming links
    //     Linking.addEventListener('url', handleDeepLink);
    //
    //
    //     const unsubscribe = Hub.listen('auth', (data) => {
    //
    //         switch (data.payload.event) {
    //             case 'signIn':
    //                 console.log('user signed in')
    //                 Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
    //                 break;
    //             case 'signUp':
    //                 console.log('user signed up')
    //                 Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
    //                 break;
    //             case 'signOut':
    //                 console.log('user signed out')
    //                 setAuthUser(null)
    //                 break;
    //             case 'signIn_failure':
    //                 console.log('user sign in failed')
    //                 break;
    //             case 'configured':
    //                 console.log('the Auth module is configured')
    //                 Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
    //                 break;
    //         }
    //     })
    //     Auth.currentAuthenticatedUser()
    //         .then((currentUser) => setAuthUser(currentUser))
    //         .catch(() => console.log("Not signed in"))
    //
    //     function performCleanup(nextAppState) {
    //         if (nextAppState === 'inactive' || nextAppState === 'background') {
    //             // Iterate through the subscription object values
    //             for (const key in subscription) {
    //                 // Check if the current object value has an "unsubscribe" method
    //                 if (typeof subscription[key].unsubscribe === 'function') {
    //                     // Call the "unsubscribe" method
    //                     subscription[key].unsubscribe()
    //                 }
    //             }
    //         }
    //     }
    //
    //     // Subscribe to AppState changes
    //     const unsubscribeAppState = AppState.addEventListener('change', performCleanup)
    //
    //     // Perform cleanup when the component is unmounted
    //     return () => {
    //         unsubscribe()
    //         unsubscribeAppState()
    //         Linking.removeEventListener('url', handleDeepLink);
    //     }
    //
    //
    //
    // }, [])


    useEffect(() => {
        if (!sub) return;
        /**
         * set Customer ()
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
                                      googleSignin
                                      // googleSignin,
                                      // cognitoSignIn,
                                      // signOut
                                  }}>

            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
