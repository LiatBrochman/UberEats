import {createContext, useContext, useEffect, useState} from "react";
import {Auth, DataStore, Hub} from "aws-amplify";
import {Courier} from "../models";
import * as Location from "expo-location";

const askLocationPermission = async () => {

    let {status} = await Location.requestForegroundPermissionsAsync()

    switch (status === "granted") {

        case true:
           return Location.getCurrentPositionAsync().then(({coords}) => ({
                latitude: coords.latitude,
                longitude: coords.longitude
            }))

        case false:
            console.error('Permission to access location was denied, please try again')
            return await askLocationPermission()
    }
}
const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [dbCourier, setDbCourier] = useState(null)
    const sub = authUser?.attributes?.sub;
    const [initLocation,setInitLocation]=useState(null)
    
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
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed')
                    break;
                case 'configured':
                    console.log('the Auth module is configured')
            }
        })

    }, [])


    useEffect(() => {
      //  console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to find sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub, null, 4))
        if (sub) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(sub,null,4))

            DataStore.query(Courier, (courier) => courier.sub.eq(sub))
                .then((couriers) => {
                    if(couriers.length > 0) {
                        setDbCourier(couriers[0])
                    }
                    else{
                        askLocationPermission().then( ({latitude,longitude}) =>{
                            setInitLocation({latitude,longitude})
                        })
                    }
                  //  console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setting dbCourier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(couriers[0], null, 4))
                })

        }
    }, [sub]);


    return (
        <AuthContext.Provider value={{
            authUser,
            dbCourier,
            sub,
            setDbCourier,
            initLocation
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)
