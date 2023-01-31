import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Courier} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
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
            }
        })

    }, [])


    useEffect(() => {
       // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub, null, 4))
        if (sub) {
            DataStore.query(Courier, (courier) => courier.sub.eq(sub))
                .then((couriers) => {
                    //fixme: no courier was found - create new courier
                    setDbCourier(couriers[0])
                //    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setting dbCourier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(couriers[0], null, 4))
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
