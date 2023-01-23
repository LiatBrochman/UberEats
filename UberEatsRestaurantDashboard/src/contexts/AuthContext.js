import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Owner} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbOwner, setDbOwner] = useState(null)
    const sub = authUser?.attributes?.sub


    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
    }, [])


    useEffect(() => {

        /**
         * create owner \ get existing owner
         */

        if (sub) getOwner().then(setDbOwner)

    }, [sub])


    const getOwner = async () => {

        return await getExistingOwner()
            .then(async owner => {
                if (owner) {
                    return owner
                } else {
                    console.log("...........going to create a new owner........")
                    // return await createNewOwner()
                }
            })
    }


    const getExistingOwner = async () => {
        try {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find owner from sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub,null,4))

            const res = await DataStore.query(Owner, o => o.sub.eq(sub))
            if(res.length>0){
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found existing owner!! ~~~~~~~~~~~~~~~~~~~~~ ", JSON.stringify(res[0], null, 4))
                return res[0]
            }else{
                console.log("\n\n ------------ couldn't find owner ------------- ", JSON.stringify(res, null, 4))

            }
        } catch (e) {
            console.error("...................")
            throw new Error(e)
        }
    }

    const createNewOwner = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ creating new owner!! ~~~~~~~~~~~~~~~~~~~~~ ")
        try {
            return await DataStore.save(new Owner({
                sub: sub,
                isDeleted: false
            }))
        } catch (e) {
            throw new Error(e)
        }
    }


    return (
        <AuthContext.Provider value={
            {
                authUser,
                dbOwner,
                sub,
                setDbOwner
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext)
