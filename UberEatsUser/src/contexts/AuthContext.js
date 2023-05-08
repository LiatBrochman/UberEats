import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import {Customer} from "../models";
import * as Updates from 'expo-updates';
import {cleanUp, executeFunctionsSequentially} from "../myExternalLibrary/globalFunctions";

const AuthContext = createContext({});


const AuthContextProvider = ({children}) => {
    // const isExpo = Constants.executionEnvironment === 'storeClient';
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const googleSignin = useCallback(() => {

        Auth.federatedSignIn({provider: "Google"}).then(() => {
            setIsLoading(true)
        })
            .catch((e) => {
                console.error('Error during federated sign-in:', e)
            })

    }, [])
    const signOut = useCallback(async () => {
        await executeFunctionsSequentially([
            () => Auth.signOut({}),
            () => setAuthUser(null),
            () => DataStore.clear(),
            () => DataStore.start(),
            () => Updates.reloadAsync()
        ])
            .catch((e) => {
                console.error('Error during federated sign-out:', e)
            })
    }, [])

    const performCleanup = useCallback(nextAppState => {
        if (nextAppState === 'inactive') {//todo :?? || nextAppState === 'background'
            // Iterate through the subscription object values
            cleanUp()
        }
    }, [subscription])

    function subscribeToCustomer() {
        subscription.customer = DataStore.observeQuery(Customer, c => c.sub.eq(authUser.attributes.sub))
            .subscribe(({items, isSynced}) => {
                if (!isSynced) return

                if (items?.length) {
                    setDbCustomer(items[0])
                    setIsLoading(false)
                } else {
                    console.log("no customer was found")
                    setIsLoading(false)
                }
            })
    }

    useEffect(() => {

        // subscription.hubListener =
        Hub.listen("auth", ({payload: {event}}) => {
            switch (event) {

                case "signIn":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ ")
                    //setIsLoading(true)
                    Auth.currentAuthenticatedUser()
                        .then(setAuthUser)
                        .catch(() => console.log("Not signed in"))
                    break;

                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ ")
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

    // useEffect(() => {
    //     if (!dbCustomer) return;
    //
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dbCustomer ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dbCustomer,null,4))
    //
    //     setIsLoading(false)
    //
    // }, [dbCustomer])


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
