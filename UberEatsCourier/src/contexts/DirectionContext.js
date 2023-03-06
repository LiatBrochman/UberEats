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
    const [tempOrigin, setTempOrigin] = useState(null)
    const [tempDestination, setTempDestination] = useState(null)
    const [tempWaypoints, setTempWaypoints] = useState([])
    const location = useRef()

    const setDirection = ({origin, waypoints, destination}) => {
        setOrigin(origin)
        setDestination(destination)
        setWaypoints(waypoints)
    }

    const setTempDirection = ({origin, waypoints, destination}) => {
        setTempOrigin(origin)
        setTempDestination(destination)
        setTempWaypoints(waypoints)
    }

    const whenDriverIsMoving = async (coords) => {
        if (!dbCourier) return
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ whenDriverIsMoving ~~~~~~~~~~~~~~~~~~~~~ :")
        setOrigin({latitude: coords.latitude, longitude: coords.longitude})
        await updateCourier(dbCourier.id, {location: {lat: coords.latitude, lng: coords.longitude}})
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
                        location.current={latitude: coords.latitude, longitude: coords.longitude}
                        await whenDriverIsMoving(coords)
                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }

    const onReady = async (result) => {
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
        await updateCourierOnETAs(Prev_ETA_arr, ETA_arr)

    }

    useEffect(() => {

        /**
         * set Direction/TempDirection according to the current status (if there is a live order => the direction must be to its related destination)
         */

        if (liveOrder) {
            setDirection({
                origin: location.current,
                waypoints: liveOrder.status === "PICKED_UP" ? [] : [{
                    latitude: liveOrder.restaurantLocation.lat,
                    longitude: liveOrder.restaurantLocation.lng
                }],
                destination: {
                    latitude: liveOrder.customerLocation.lat,
                    longitude: liveOrder.customerLocation.lng
                }
            })
            setTempDirection({origin: null, waypoints: [], destination: null})
        }

        if (pressedOrder && !liveOrder) {
            setTempDirection({
                origin: origin,
                waypoints: [{
                    latitude: pressedOrder.restaurantLocation.lat,
                    longitude: pressedOrder.restaurantLocation.lng
                }],
                destination: {
                    latitude: pressedOrder.customerLocation.lat,
                    longitude: pressedOrder.customerLocation.lng
                }
            })
        }


    }, [liveOrder, pressedOrder])

    useEffect(() => {
        startWatchingDriverLocation().then(unsub => subscription.location = unsub)
        // return ()=>{
        //     subscription.location.unsubscribe()
        // }
    }, [])

    return (
        <DirectionContext.Provider value={{
            startWatchingDriverLocation,
            setDirection,
            setTempDirection,
            onReady,
            ETA_toCustomer, setETA_toCustomer,
            ETA_toRestaurant, setETA_toRestaurant,
            distance, setDistance,
            origin, destination, waypoints,
            tempOrigin, tempDestination, tempWaypoints,
            apiKey,
            mapRef

        }}>
            {children}
        </DirectionContext.Provider>
    )
}

export default DirectionContextProvider

export const useDirectionContext = () => useContext(DirectionContext)