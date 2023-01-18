import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Customer} from "../models";
import {subscription} from "../screens/HomeScreen";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbCustomer, setDbCustomer] = useState(null);
    const sub = authUser?.attributes?.sub;


    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
    }, []);

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
