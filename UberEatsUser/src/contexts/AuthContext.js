import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import {Customer} from "../models";
import * as Google from "expo-auth-session/providers/google";


const AuthContext = createContext({});

function cleanUp() {
    for (const key in subscription) {
        // Check if the current object value has an "unsubscribe" method
        if (typeof subscription[key].unsubscribe === 'function') {
            // Call the "unsubscribe" method
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ unsubscribing from ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription[key], null, 4))
            subscription[key].unsubscribe()
        }
    }
}

const AuthContextProvider = ({children}) => {
    // const isExpo = Constants.executionEnvironment === 'storeClient';
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const googleSignin = useCallback(() => {
        try {
            Auth.federatedSignIn({provider: "Google"}).then(() => {
                setIsLoading(true)
            })
        } catch (e) {
            console.error('Error during federated sign-in:', e)
        }
    }, [])
    const signOut = useCallback(() => {
        try {
            setIsLoading(true)
            Auth.signOut({global: true}).finally(() => setIsLoading(false))
        } catch (e) {
            console.error('Error during federated sign-out:', e)
        }
    }, [])
    const performCleanup = useCallback(nextAppState => {
        if (nextAppState === 'inactive') {//todo :?? || nextAppState === 'background'
            // Iterate through the subscription object values
            cleanUp()
        }
    }, [subscription])
    const [isLoading, setIsLoading] = useState(false)

    function subscribeToCustomer() {
        subscription.customer = DataStore.observeQuery(Customer, c => c.sub.eq(authUser.attributes.sub))
            .subscribe(({items, isSynced}) => {
                if (!isSynced) return
                if (items?.length) {
                    setDbCustomer(items[0])
                    setIsLoading(false)
                }
            })
    }

    useEffect(() => {

        // subscription.hubListener =
        Hub.listen("auth", ({payload: {event, data}}) => {
            switch (event) {

                // case "parsingCallbackUrl":
                //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ event ~~~~~~~~~~~~~~~~~~~~~ : parsingCallbackUrl")
                //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ data.url ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(data.url,null,4))
                //     if (/signInRedirect/.test(data.url)) {
                //         // if (!/signOutRedirect$/.test(data.url)) {
                //     //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setMiddleware(true) ~~~~~~~~~~~~~~~~~~~~~ ")
                //     //     //Alert.alert("parsingCallbackUrl, setMiddleware(true)")
                //     //     Alert.alert("data.url=",data.url+"")
                //         setMiddleware(true)
                //     }
                //     break;

                case "signIn":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ ")
                    setIsLoading(true)
                    Auth.currentAuthenticatedUser()
                        .then(setAuthUser)
                        .catch(() => console.log("Not signed in"))
                    break;

                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ ")
                    setAuthUser(null)
                    setIsLoading(false)
                    cleanUp()
                    break;

                default:
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ event ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(event, null, 4))

            }
        })

        Auth.currentSession()
            .then(() => {
                setIsLoading(true)
                Auth.currentAuthenticatedUser().then(setAuthUser)
            })
            .catch(() => {
                console.log("Not signed in")
                setIsLoading(false)
            })

        AppState.addEventListener('change', performCleanup)


    }, [])

    useEffect(() => {

        authUser?.attributes?.sub ? subscribeToCustomer() : setDbCustomer(null)

    }, [authUser])

    useEffect(() => {
        if (!dbCustomer) return;

        setIsLoading(false)

    }, [dbCustomer])


    return (
        <AuthContext.Provider value=
                                  {{
                                      isLoading,
                                      setIsLoading,
                                      authUser,
                                      dbCustomer,
                                      setDbCustomer,
                                      googleSignin,
                                      signOut,
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
