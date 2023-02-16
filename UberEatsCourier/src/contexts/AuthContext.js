import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Courier} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCourier, setDbCourier] = useState(null)
    const [customState, setCustomState] = useState(null)
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
        Auth.currentAuthenticatedUser({bypassCache: true})
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => console.log("Not signed in"))

        return unsubscribe
    }, [])


    useEffect(() => {
        if (sub) {
            subscription.courier = DataStore.observeQuery(Courier, c => c.sub.eq(sub))
                .subscribe(({items, isSynced}) => {
                    if (items?.length) {
                        isSynced && setDbCourier(items[0])
                    } else {
                        console.log("no courier was found")
                    }
                })
        }
    }, [sub])


    return (
        <AuthContext.Provider value={{authUser, dbCourier, sub, setDbCourier, googleSignin, cognitoSignIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)
