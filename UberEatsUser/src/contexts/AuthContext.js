import {createContext, useState, useEffect, useContext} from "react";
import {Auth, DataStore} from "aws-amplify";
import {User} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbUser, setDbUser] = useState(null)
    const sub = authUser?.attributes?.sub;
    useEffect(() => {
        console.log("\n\nauthContext. sub: 6,11$", sub)
    }, [sub])
    useEffect(() => {
        console.log("\n\nauthContext. dbUser: 7,10,14$", dbUser)
    }, [dbUser])
    useEffect(() => {
        console.log("\n\nauthContext. authUser: 8,12$", authUser)
    }, [authUser])


    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(usr => setAuthUser(usr))
    }, [])

    useEffect(() => {
        DataStore.query(User, user => user.sub.eq(sub)).then((users) => setDbUser(users[0]))
    }, [sub]);


    return (
        <AuthContext.Provider value={{authUser, dbUser, sub, setDbUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)
