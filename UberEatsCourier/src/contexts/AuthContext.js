import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';


const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    // const isExpo = Constants.executionEnvironment === 'storeClient';
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ isExpo ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(isExpo, null, 4))

    WebBrowser.maybeCompleteAuthSession();
    const [authUser, setAuthUser] = useState(null)
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
    const [middleware, setMiddleware] = useState(false)

    useEffect(() => {

        subscription.hubListener = Hub.listen("auth", ({payload: {event, data}}) => {
            switch (event) {

                // case "parsingCallbackUrl":
                //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ event ~~~~~~~~~~~~~~~~~~~~~ : parsingCallbackUrl")
                //     if (/signInRedirect/.test(data.url)) {
                //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setMiddleware(true) ~~~~~~~~~~~~~~~~~~~~~ ")
                //         setMiddleware(true)
                //     }
                //     break;

                case "signIn":
                    setMiddleware(true)
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signIn ~~~~~~~~~~~~~~~~~~~~~ ")
                    Auth.currentAuthenticatedUser()
                        .then(setAuthUser)
                        .catch(() => console.log("Not signed in"))
                    break;

                case "oAuthSignOut":
                case "signOut":
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ signOut ~~~~~~~~~~~~~~~~~~~~~ ")
                    setAuthUser(null)
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setMiddleware(false) ~~~~~~~~~~~~~~~~~~~~~ ")
                    setMiddleware(false)
                    break;

                default:
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ event ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(event, null, 4))

            }
        })


        Auth.currentAuthenticatedUser()
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => {
                setMiddleware(false)
                console.log("Not signed in")
            })

        AppState.addEventListener('change', performCleanup)


    }, [])


    return (
        <AuthContext.Provider value=
                                  {{
                                      sub,
                                      middleware,
                                      setMiddleware,
                                      authUser,
                                      googleSignin,
                                      cognitoSignIn,
                                      signOut,
                                  }}>

            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
