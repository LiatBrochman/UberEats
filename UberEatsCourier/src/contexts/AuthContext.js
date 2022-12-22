import {createContext, useState, useEffect, useContext} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Courier} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbCourier, setDbCourier] = useState(null)
    const sub = authUser?.attributes?.sub;

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
    }, []);


    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub, null, 4))
        if (sub) {
            DataStore.query(Courier, (courier) => courier.sub.eq(sub))
                .then((couriers) => {
                    setDbCourier(couriers[0])
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setting dbCourier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(couriers[0], null, 4))
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
