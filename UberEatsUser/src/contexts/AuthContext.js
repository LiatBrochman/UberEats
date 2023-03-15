import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {AppState} from 'react-native';
import {Customer} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const sub = authUser?.attributes?.sub
    const googleSignin = useCallback(() => {
        Auth.federatedSignIn({provider: 'Google'}).then(setAuthUser)
    }, [])
    const cognitoSignIn = useCallback(() => {
        Auth.federatedSignIn().then(setAuthUser)
    }, [])
    const signOut = useCallback(() => {
        Auth.signOut({global: true}).then(() => setAuthUser(null))
    }, [])

    useEffect(() => {

        const unsubscribe = Hub.listen('auth', (data) => {

            switch (data.payload.event) {
                case 'signIn':
                    console.log('user signed in')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
                case 'signUp':
                    console.log('user signed up')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
                case 'signOut':
                    console.log('user signed out')
                    setAuthUser(null)
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed')
                    break;
                case 'configured':
                    console.log('the Auth module is configured')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
            }
        })
        Auth.currentAuthenticatedUser()
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => console.log("Not signed in"))

        function performCleanup(nextAppState) {
            if (nextAppState === 'inactive' || nextAppState === 'background') {
                // Iterate through the subscription object values
                for (const key in subscription) {
                    // Check if the current object value has an "unsubscribe" method
                    if (typeof subscription[key].unsubscribe === 'function') {
                        // Call the "unsubscribe" method
                        subscription[key].unsubscribe()
                    }
                }
            }
        }

        // Subscribe to AppState changes
        const unsubscribeAppState = AppState.addEventListener('change', performCleanup)

        // Perform cleanup when the component is unmounted
        return () => {
            unsubscribe()
            unsubscribeAppState()
        }


    }, [])


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
                                      googleSignin,
                                      cognitoSignIn,
                                      signOut
                                  }}>

            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext);
