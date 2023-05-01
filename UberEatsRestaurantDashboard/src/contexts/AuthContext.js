import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Owner} from "../models";


const AuthContext = createContext({})

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbOwner, setDbOwner] = useState(null)
    const sub = authUser?.attributes?.sub



    useEffect(() => {
        const unsubscribe = Hub.listen('auth', (data) => {

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

        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)

        function cleanupSubscriptions(event) {
            event.preventDefault()
            Object.entries(window.subscription).forEach(([subName,unSubFunc]) => {
                if (unSubFunc?.unsubscribe) {
                    unSubFunc.unsubscribe()
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ Unsubscribed from :", subName)
                }
            })
        }

        window.addEventListener("beforeunload", cleanupSubscriptions);

        return unsubscribe

    }, [])

    function startSubscribingOwner() {
        window.subscription.owner = DataStore.observeQuery(Owner, o => o.sub.eq(sub)).subscribe(({items, isSynced}) => {
            if (isSynced) {
                if (items.length) {
                    setDbOwner(items[0])
                } else {
                    createNewOwner()
                }
            }
        })
    }

    async function getOwner_fixed() {
        startSubscribingOwner()
    }

    useEffect(() => {
        /**
         * create owner \ get existing owner
         */

        if (!sub) return
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ authUser ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(authUser?.attributes, null, 4))

        getOwner_fixed()

        // getOwner().then(newOwner=>{
        //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ newOwner ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(newOwner,null,4))
        //     if(!newOwner){
        //         setTimeout(()=>{
        //             setDbOwner(newOwner)
        //         },5000)
        //     }else{
        //         setDbOwner(newOwner)
        //     }
        //
        // })

        // return () => {
        //     window?.subscription?.owner?.unsubscribe()
        //     window.alert("unsubscribing from :", dbOwner?.name)
        // }
    }, [sub])


    const getOwner = async (attempt = 3) => {

        const existingOwner = await getExistingOwner()

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ existingOwner ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingOwner, null, 4))

        if (existingOwner) return existingOwner

        if (!existingOwner && attempt > 0) {
            setTimeout(() => {
                return getOwner(attempt - 1)
            }, 1000)
        }

        if (attempt === 0 && !existingOwner) {
            console.log("...........going to create a new owner........")
            return await createNewOwner()
        }
    }

    const getExistingOwner = async () => {
        try {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find owner with sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub, null, 4))

            // const owners = await DataStore.query(Owner, o => o.sub.eq(sub), {sort: s => s.createdAt(SortDirection.ASCENDING)})
            const owners = await DataStore.query(Owner, o => o.sub.eq(sub))
            if (owners.length > 0) {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found owners with the same sub ~~~~~~~~~~~~~~~~~~~~~ ", JSON.stringify(owners, null, 4))
                return owners[0]
            } else {
                console.log("\n\n ------------ couldn't find owner ------------- ", JSON.stringify(owners, null, 4))
                return null
            }
        } catch (e) {
            console.error("..........error.........", e)
        }
    }

    const createNewOwner = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ creating new owner!! ~~~~~~~~~~~~~~~~~~~~~ ")
        try {
            const newOwner = await DataStore.save(new Owner({
                sub: sub,
                isDeleted: false,
                email: authUser.attributes.email,
            }))


            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ newOwner ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(newOwner, null, 4))

            return newOwner

        } catch (e) {
            console.error("..........error.........", e)
        }
    }


    async function signOut() {
        try {
            Auth.signOut({global: true}).then(()=>setAuthUser(null))
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
