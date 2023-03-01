import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub, SortDirection} from "aws-amplify";
import {Owner} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbOwner, setDbOwner] = useState(null)
    const sub = authUser?.attributes?.sub

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
                    setAuthUser(null)
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
        /**
         * create owner \ get existing owner
         */

        if (sub) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ authUser ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(authUser?.attributes,null,4));

            (async () => {
              const tempOwner= await getOwner()
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ tempOwner ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(tempOwner,null,4))
                setDbOwner(tempOwner)
            })();


        }

    }, [sub])


    const getOwner = async () => {
        return await getExistingOwner()
            .then(async owner => {
                if (owner) {
                    return owner
                } else {
                    console.log("...........going to create a new owner........")
                    return await createNewOwner()
                }
            })
    }


    const getExistingOwner = async () => {
        try {
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find owner from sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub, null, 4))

            const owners = await DataStore.query(Owner, o => o.sub.eq(sub),{sort: s=>s.createdAt(SortDirection.ASCENDING)})

            if (owners.length > 0) {
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found existing owner!! ~~~~~~~~~~~~~~~~~~~~~ ", JSON.stringify(owners[0], null, 4))
                return owners[0]
            } else {
                console.log("\n\n ------------ couldn't find owner ------------- ", JSON.stringify(owners, null, 4))

            }
        } catch (e) {
            console.error("..........error.........")
            throw new Error(e)
        }
    }

    const createNewOwner = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ creating new owner!! ~~~~~~~~~~~~~~~~~~~~~ ")
        try {
            return await DataStore.save(new Owner({
                sub: sub,
                isDeleted: false,
                email: authUser.attributes.email,
            }))
        } catch (e) {
            throw new Error(e)
        }
    }


    async function signOut() {
        try {
            await Auth.signOut()
        } catch (error) {
            console.log('Error signing out:', error)
        }
    }


    return (
        <AuthContext.Provider value={
            {
                authUser,
                dbOwner,
                sub,
                setDbOwner,
                signOut
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext)
