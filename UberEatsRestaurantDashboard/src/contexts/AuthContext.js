import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Owner} from "../models";
import {cleanUp, executeFunctionsSequentially} from "../myExternalLibrary/globalFunctions";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {

    const [authUser, setAuthUser] = useState(null)
    const [dbOwner, setDbOwner] = useState(null)

    const signOut = useCallback(() => {
           executeFunctionsSequentially([
            () => cleanUp(),
            () => setAuthUser(null),
            () => DataStore.clear(),
            () => DataStore.start(),
            ()=>{console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ finished clearing local storage ~~~~~~~~~~~~~~~~~~~~~ "); return 1},
            () => Auth.signOut(),
         ]).catch((e) => {
                console.error('Error during federated sign-out:', e)
            })
    },[])

    const createNewOwner = useCallback( () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ creating new owner!! ~~~~~~~~~~~~~~~~~~~~~ ")
             DataStore.save(new Owner({
                sub: authUser.attributes.sub,
                isDeleted: false,
                email: authUser.attributes.email,
            }))
    }, [authUser])
    const startSubscribingOwner = useCallback(() => {
        if(!authUser) return;
        window.subscription.owner = DataStore.observeQuery(Owner, o => o.sub.eq(authUser.attributes.sub))
            .subscribe(({items, isSynced}) => {
                if (isSynced) {
                    if (items.length) {
                        setDbOwner(items[0])
                    } else {
                        createNewOwner()
                    }
                }
            })
    }, [authUser])


    useEffect(() => {

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

        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)


    }, [])


    useEffect(() => {
        if (! authUser?.attributes?.sub) return;

        startSubscribingOwner()

    }, [authUser])


    return (
        <AuthContext.Provider value={
            {
                authUser,
                dbOwner,
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
