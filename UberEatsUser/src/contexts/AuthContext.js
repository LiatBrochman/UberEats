import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Customer} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCustomer, setDbCustomer] = useState(null)
    const [customState, setCustomState] = useState(null)
    const sub = authUser?.attributes?.sub
    const cognitoSignIn = useCallback(() => {
        Auth.federatedSignIn().then(setAuthUser)
    }, [])
    const googleSignin = useCallback(() => {
        Auth.federatedSignIn({provider: 'Google', options: { prompt: 'select_account' }}).then(setAuthUser)
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
                case "customOAuthState":
                    setCustomState(data);
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
            .catch(() => console.log("Not signed in"));

        return unsubscribe;
    }, [])

    useEffect(() => {
        /**
         * set Customer ()
         */
        subscription.customer = DataStore.observeQuery(Customer, c => c.sub.eq(sub))
            .subscribe(({items, isSynced}) => {
                isSynced && setDbCustomer(items[0])
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ authUser ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(authUser,null,4))
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ Customer ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items[0],null,4))
            })
        // return subscription?.customer?.unsubscribe()
    }, [sub])

    const signOut = () => {
        Auth.signOut({ global: true })
    }

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
