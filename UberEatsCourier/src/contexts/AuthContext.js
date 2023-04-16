import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";


const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const isExpo = Constants.executionEnvironment === 'storeClient';
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const sub = authUser?.attributes?.sub;
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
            Auth.signOut({global: true}).then(setAuthUser(null))
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
                        Auth.currentAuthenticatedUser().then(setAuthUser(null))
                            // .finally(DataStore.clear().then(() => DataStore.start()).catch((e) => console.error("couldn't clear the datastore", e)))
                    }
                    break;
            }
        })


        Auth.currentAuthenticatedUser()
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => console.log("Not signed in"))

        AppState.addEventListener('change', performCleanup)


    }, [])

    return (
        <AuthContext.Provider value=
                                  {{
                                      authUser,
                                      dbCustomer,
                                      sub,
                                      setDbCustomer,
                                      googleSignin,
                                      cognitoSignIn,
                                      signOut
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
