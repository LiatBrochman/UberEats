import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import {Customer} from "../models";
import * as Updates from 'expo-updates';
import {cleanUp, executeFunctionsSequentially} from "../myExternalLibrary/globalFunctions";
// import * as Constants from "constants";

const AuthContext = createContext({});

//todo: subscribeToCustomer should be declared somewhere else
function subscribeToCustomer({setDbCustomer, setIsLoading, authUser}) {
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


const AuthContextProvider = ({children}) => {
    // const isExpo = Constants.executionEnvironment === 'storeClient';
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    const [authUser, setAuthUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    //todo: dbCustomer should be initiated somewhere else
    const [dbCustomer, setDbCustomer] = useState(null)

    const googleSignin = useCallback(() => {

        Auth.federatedSignIn({provider: "Google"}).then(() => {
            setIsLoading(true)
            Auth.currentAuthenticatedUser().then(setAuthUser)
        }).catch((e) => {
            console.error('Error during federated sign-in:', e)
        })

    }, [])
    const signOut = useCallback(async () => {
        await executeFunctionsSequentially([
            () => setIsLoading(true),
            () => Auth.signOut({}),
            cleanUp,
            () => setAuthUser(null),
            DataStore.clear,
            DataStore.start,
            Updates.reloadAsync
        ])
            .catch((e) => {
                console.error('Error during federated sign-out:', e)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    const performCleanup = useCallback(nextAppState => {
        if (nextAppState === 'inactive') {//todo :?? || nextAppState === 'background'
            // Iterate through the subscription object values
            cleanUp()
        }
    }, [subscription])


    useEffect(() => {

        Hub.listen("auth", ({payload: {event}}) => {
            switch (event) {

                case "signIn":
                case "signUp":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ ")
                    Auth.currentAuthenticatedUser()
                        .then(setAuthUser)
                        .catch(() => console.log("Not signed in"))
                    break;

                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ ")
                    break;

                default:
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ event ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(event, null, 4))

            }
        })

        // !isExpo &&
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

    //todo: move the whole useEffect together with the dbCustomer
    useEffect(() => {

        authUser?.attributes?.sub ? subscribeToCustomer({setDbCustomer,setIsLoading,authUser}) : setDbCustomer(null)

    }, [authUser])


    return (
        <AuthContext.Provider value=
                                  {{
                                      isLoading,
                                      setIsLoading,
                                      authUser,
                                      googleSignin,
                                      signOut,

                                    //todo: to be moved
                                      dbCustomer,
                                      setDbCustomer,
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
