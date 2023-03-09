import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useOrderContext} from "./OrderContext";
import * as Location from "expo-location";
import {GOOGLE_API_KEY} from '@env';
import {updateCourier} from "../myExternalLibrary/genericUpdate";
import {getETA_array} from "../myExternalLibrary/LocationFunctions";
import {useCourierContext} from "./CourierContext";

const DirectionContext = createContext({})


const DirectionContextProvider = ({children}) => {
    const apiKey = GOOGLE_API_KEY
    const {dbCourier} = useCourierContext()
    const {liveOrder, pressedOrder} = useOrderContext()
    const {updateCourierOnETAs} = useCourierContext()
    const mapRef = useRef(null)

    const [ETA_toCustomer, setETA_toCustomer] = useState(null)
    const [ETA_toRestaurant, setETA_toRestaurant] = useState(null)
    const [distance, setDistance] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [destination, setDestination] = useState(null)
    const [waypoints, setWaypoints] = useState([])
    // const [tempDestination, setTempDestination] = useState(null)
    // const [tempWaypoints, setTempWaypoints] = useState([])
    // const location = useRef()

    const setDirection = ({waypoints, destination}) => {
        setDestination(destination)
        setWaypoints(waypoints)
    }

    // const setTempDirection = ({origin, waypoints, destination}) => {
    //     setTempDestination(destination)
    //     setTempWaypoints(waypoints)
    // }

    const whenDriverIsMoving = async ({latitude, longitude}) => {
        if (dbCourier && latitude && longitude) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ whenDriverIsMoving / on init ~~~~~~~~~~~~~~~~~~~~~ lat,lng :", latitude, longitude)
            setOrigin({latitude, longitude})

            const areCoordsEqual = (dbCourier.lat === latitude && dbCourier.lng === longitude)

            if (areCoordsEqual) {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ No need to update ~~~~~~~~~~~~~~~~~~~~~")
            } else {
                await updateCourier(dbCourier.id, {location: {lat: latitude, lng: longitude}})
            }
        }

    }

    const startWatchingDriverLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()

        switch (status === "granted") {

            case true:
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100
                    },
                    async ({coords}) => {
                        // location.current = {latitude: coords.latitude, longitude: coords.longitude}
                        await whenDriverIsMoving(coords)
                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }

    const onReady = (result) => {
        setDistance(result.distance)
        const ETA_arr = getETA_array(result)
        const Prev_ETA_arr = [ETA_toCustomer, ETA_toRestaurant]

        switch (ETA_arr.length) {
            case 0:
                setETA_toRestaurant(0)
                setETA_toCustomer(0)
                break;
            case 1:
                setETA_toRestaurant(0)
                setETA_toCustomer(ETA_arr[0])
                break;
            case 2:
                setETA_toRestaurant(ETA_arr[0])
                setETA_toCustomer(ETA_arr[1])
                break;
            default:
                return
        }
        liveOrder && updateCourierOnETAs(Prev_ETA_arr, ETA_arr)

    }

    const clearDirections= ()=>{
        setDestination(null)
        setWaypoints([])
    }

    useEffect(() => {

        /**
         * set Direction/TempDirection according to the current status (if there is a live order => the direction must be to its related destination)
         */
        if (!liveOrder && !pressedOrder) return

        const order = liveOrder ?? pressedOrder

        setDirection({
            origin: origin,
            waypoints: order.status === "PICKED_UP" ? [] : [{
                latitude: order.restaurantLocation.lat,
                longitude: order.restaurantLocation.lng
            }],
            destination: {
                latitude: order.customerLocation.lat,
                longitude: order.customerLocation.lng
            }
        })


    }, [liveOrder, pressedOrder])

    useEffect(() => {

        Location.getCurrentPositionAsync().then(({coords: {latitude, longitude}}) => setOrigin({latitude, longitude}))

        startWatchingDriverLocation().then(unsub => subscription.location = unsub)
        // return ()=>{
        //     subscription.location.unsubscribe()
        // }
    }, [])

    return (
        <DirectionContext.Provider value={{
            startWatchingDriverLocation,
            setDirection,
            clearDirections,
            // setTempDirection,
            onReady,
            ETA_toCustomer, setETA_toCustomer,
            ETA_toRestaurant, setETA_toRestaurant,
            distance, setDistance,
            origin, destination, waypoints,
            // tempDestination, tempWaypoints,
            apiKey,
            mapRef

        }}>
            {children}
        </DirectionContext.Provider>
    )
}

export default DirectionContextProvider

export const useDirectionContext = () => useContext(DirectionContext)