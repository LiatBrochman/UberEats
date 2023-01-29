import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Customer} from "../models";


const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbCustomer, setDbCustomer] = useState(null);
    const sub = authUser?.attributes?.sub;


    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)

        Hub.listen('auth', (data) => {

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
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed')
                    break;
                case 'configured':
                    console.log('the Auth module is configured')
            }
        })

    }, [])

    useEffect(() => {

        subscription.customer = DataStore.observeQuery(Customer, c => c.sub.eq(sub))
            .subscribe(({items}) => {
                setDbCustomer(items[0])
            })
        // return subscription?.customer?.unsubscribe()

    }, [sub]);


    return (
        <AuthContext.Provider value={{authUser, dbCustomer, sub, setDbCustomer}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
