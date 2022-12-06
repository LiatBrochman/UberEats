import { createContext, useEffect, useState, useContext } from "react";
import {Auth, DataStore} from "aws-amplify";
import {User} from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const sub = authUser?.attributes?.sub;

    // useEffect(() => {
    //     console.log("\n\nsub:", sub)
    // }, [sub])
    // useEffect(() => {
    //     console.log("\n\ndbUser:", dbUser)
    // }, [dbUser])
    // useEffect(() => {
    //     console.log("\n\nauthUser:", authUser)
    // }, [authUser])


    useEffect(() => {
        // console.log("\n\nauthUser before:", authUser)
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
            // console.log('\n\nuser', usr)
            // return setAuthUser(usr)
        // })
        // console.log("\n\nauthUser after:", authUser)
    }, []);

    useEffect(() => {
        // console.log("\n\ndbUser before:", dbUser)

        DataStore.query(User, (user) => user.sub.eq(sub)).then((users) =>
            setDbUser(users[0]))
        // console.log("\n\ndbUser after:", dbUser)

    }, [sub]);


    return (
        <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
