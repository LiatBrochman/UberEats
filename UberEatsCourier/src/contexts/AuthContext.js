import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Courier} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCourier, setDbCourier] = useState(null)
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
                    break;
            }
        })

    }, [])


    useEffect(() => {
        if (sub) {
            DataStore.query(Courier, c => c.sub.eq(sub))
                .then((couriers) => {
                    if(couriers.length>0) {
                        setDbCourier(couriers[0])
                    }else{
                        console.log("no courier was found")
                        
                    }
                })
        }
    }, [sub]);


    return (
        <AuthContext.Provider value={{authUser, dbCourier, sub, setDbCourier}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)
