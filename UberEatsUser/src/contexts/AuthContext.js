import { createContext, useEffect, useState, useContext } from "react";
import {Auth, DataStore} from "aws-amplify";
import {Customer} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbCustomer, setDbCustomer] = useState(null);
    const sub = authUser?.attributes?.sub;



    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
    }, []);

    useEffect(() => {

        DataStore.query(Customer, customer => customer.and(c=> [c.sub.eq(sub),c.isDeleted.eq(false)]))
            .then(customers => setDbCustomer(customers[0]))

    }, [sub])


    return (
        <AuthContext.Provider value={{ authUser, dbCustomer, sub, setDbCustomer }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
