import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Customer, Owner} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState({})
    const [dbOwner, setDbOwner] = useState({})
    const sub = authUser?.attributes?.sub


    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
    }, [])


    useEffect(() => {

        /**
         * create owner \ get existing owner
         */

        if (sub) getOwner().then(setDbOwner)

    }, [sub])





    const getOwner = async () => {

        const existingOwner = await getExistingOwner()
        return existingOwner || await createNewOwner()
    }

    const getExistingOwner = async () => {
        try{
            const [res] = await DataStore.query(Owner, o => o.sub.eq(sub))
            return res
        }catch (e){
            throw new Error(e)
        }
    }

    const createNewOwner = async () => {
        try{
        return await DataStore.save(new Owner({
            sub: sub,
            isDeleted: false
        }))
        }catch (e){
            throw new Error(e)
        }
    }


    return (
        <AuthContext.Provider value={
            {authUser, dbOwner, sub, setDbOwner}
        }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext)
