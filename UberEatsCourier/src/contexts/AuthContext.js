import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import * as Updates from 'expo-updates';
import {cleanUp, executeFunctionsSequentially} from "../myExternalLibrary/globalFunctions";


const AuthContext = createContext({});


const AuthContextProvider = ({children}) => {
    // const isExpo = Constants.executionEnvironment === 'storeClient';
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    const [authUser, setAuthUser] = useState(null)
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
        await executeFunctionsSequentially([Auth.signOut({}), setAuthUser(null), DataStore.clear(), DataStore.start(), Updates.reloadAsync()])
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
                    // setAuthUser(null)
                    // setIsLoading(false)
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


    return (
        <AuthContext.Provider value=
                                  {{
                                      isLoading,
                                      setIsLoading,
                                      authUser,
                                      googleSignin,
                                      signOut,
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
